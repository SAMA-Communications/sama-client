import DownloadManager from "@adapters/downloadManager";
import api from "@api/api";
import encryptionService from "./encryptionService";
import jwtDecode from "jwt-decode";
import localforage from "localforage";
import navigateTo from "@utils/navigation/navigate_to";
import store from "@store/store";
import { addUser } from "@store/values/Participants";
import {
  addMessage,
  addMessages,
  markMessagesAsRead,
  removeMessage,
  upsertMessage,
  upsertMessages,
} from "@store/values/Messages";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import {
  insertChats,
  markConversationAsRead,
  removeChat,
  updateLastMessageField,
  upsertChat,
  upsertParticipants,
} from "@store/values/Conversations";

class MessagesService {
  currentChatId;
  typingTimers = {};

  async #tryToCreateESession(message) {
    if (message.encrypted_message_type === 0) {
      console.log("[ecnryption] Try to connect from new message");
      await encryptionService.createEncryptionSession(message.from, message);
    } else {
      const decryptedMessage = encryptionService.decryptMessage(
        message,
        message.from
      );
      store.dispatch(
        upsertMessage({
          _id: message._id,
          body: decryptedMessage,
        })
      );
    }
  }

  constructor() {
    api.onMessageStatusListener = (message) => {
      store.dispatch(markMessagesAsRead(message.ids));
      store.dispatch(
        markConversationAsRead({
          cid: message.cid,
          mid: Array.isArray(message.ids) ? message.ids[0] : message.ids,
        })
      );
    };

    api.onMessageListener = async (message) => {
      const attachments = message.attachments;
      if (attachments) {
        const urls = await api.getDownloadUrlForFiles({
          file_ids: attachments.map((obj) => obj.file_id),
        });
        message.attachments = attachments.map((obj) => {
          return { ...obj, file_url: urls[obj.file_id] };
        });
      }

      const userInfo = jwtDecode(localStorage.getItem("sessionId"));
      message.from === userInfo._id && (message["status"] = "sent");
      store.dispatch(addMessage(message));
      store.dispatch(upsertChat({ _id: message.cid, typing_users: null }));

      let countOfNewMessages = 0;
      message.cid === this.currentChatId && document.hasFocus()
        ? api.markConversationAsRead({ cid: this.currentChatId })
        : (countOfNewMessages = message.from === userInfo._id ? 0 : 1);
      store.dispatch(
        updateLastMessageField({
          cid: message.cid,
          msg: message,
          countOfNewMessages,
        })
      );

      const conv = store.getState().conversations.entities[message.cid];
      if (conv && message.x?.type === "added_participant") {
        const user = message.x.user;
        store.dispatch(addUser(user));
        store.dispatch(
          upsertChat({
            _id: message.cid,
            participants: [...(conv.participants || []), user._id],
          })
        );
      }
      if (
        conv &&
        (message.x?.type === "removed_participant" ||
          message.x?.type === "left_participants")
      ) {
        const user = message.x.user;
        store.dispatch(
          upsertChat({
            _id: message.cid,
            participants: conv.participants.filter((uId) => uId !== user._id),
          })
        );
      }
      if (conv.is_encrypted) {
        await this.#tryToCreateESession(message);
      }
    };

    api.onUserTypingListener = (data) => {
      const { cid, from } = data;

      const conversation = store.getState().conversations.entities[cid];
      const newTypingUsersArray = [...(conversation.typing_users || [])];
      !newTypingUsersArray.includes(from) && newTypingUsersArray.push(from);
      store.dispatch(
        upsertChat({
          _id: cid,
          typing_users: newTypingUsersArray,
        })
      );

      const { clearTypingStatus, lastRequestTime } =
        this.typingTimers[cid] || {};

      if (new Date() - lastRequestTime > 3000 && clearTypingStatus) {
        clearTimeout(clearTypingStatus);
      }

      this.typingTimers[cid] = {
        clearTypingStatus: setTimeout(() => {
          const conversation = store.getState().conversations.entities[cid];
          store.dispatch(
            upsertChat({
              _id: cid,
              typing_users: conversation.typing_users?.filter(
                (id) => id !== from
              ),
            })
          );
        }, 4000),
        lastRequestTime: new Date(),
      };
    };

    store.subscribe(() => {
      let previousValue = this.currentChatId;
      this.currentChatId = store.getState().selectedConversation.value.id;

      if (
        this.currentChatId &&
        (!previousValue || previousValue !== this.currentChatId)
      ) {
        this.syncData();
      }
    });
  }

  async syncData() {
    const cid = this.currentChatId;
    const params = {
      cid,
      limit: +process.env.REACT_APP_MESSAGES_COUNT_TO_PRELOAD,
    };

    const lastMessage = Object.values(
      store.getState().messages.entities
    ).findLast((el) => el.cid === cid);

    if (lastMessage) {
      params.updated_at = {
        gt:
          lastMessage.created_at ||
          new Date(lastMessage.t * 1000).toISOString(),
      };
    }

    api
      .messageList(params)
      .then(async (arr) => {
        const messagesIds = arr.map((el) => el._id).reverse();

        store.dispatch(addMessages(arr));
        store.dispatch(
          upsertChat({ _id: this.currentChatId, messagesIds, activated: true })
        );

        const mAttachments = arr.reduce((acc, msg) => {
          if (msg.attachments) {
            msg.attachments.forEach((obj) => {
              if (!acc[obj.file_id]) {
                acc[obj.file_id] = { _id: msg._id, ...obj };
              } else {
                const existingId = acc[obj.file_id]._id;
                acc[obj.file_id]._id = Array.isArray(existingId)
                  ? [msg._id, ...existingId]
                  : [msg._id, existingId];
              }
            });
          }
          return acc;
        }, {});

        if (Object.keys(mAttachments).length > 0) {
          const msgs = await DownloadManager.getDownloadFileLinks(mAttachments);
          const messagesToUpdate = msgs.flatMap((msg) =>
            (Array.isArray(msg._id) ? msg._id : [msg._id]).map((mid) => ({
              ...msg,
              _id: mid,
            }))
          );
          store.dispatch(upsertMessages(messagesToUpdate));
        }
        const conv =
          store.getState().conversations?.entities?.[this.currentChatId];

        if (conv.type !== "u" && this.currentChatId) {
          const participants = await api.getParticipantsByCids({
            cids: [this.currentChatId],
          });
          store.dispatch(
            upsertParticipants({
              cid: this.currentChatId,
              participants: participants.map((p) => p._id),
            })
          );
        }

        if (conv.is_encrypted) {
          setTimeout(() => {
            //replace in the future, should be called after the session is created
            arr.forEach(
              async (message) => await this.#tryToCreateESession(message)
            );
          }, 500);
        }
      })
      .catch((err) => {
        console.log(err);

        store.dispatch(removeChat(cid));
        store.dispatch(setSelectedConversation({}));
        navigateTo("/");
      });
  }

  async sendMessage(message) {
    const { server_mid, t } = await api.messageCreate(message);
    const { mid, body, visibleBody, cid, from, encrypted_message_type } =
      message;

    const mObject = {
      _id: server_mid,
      body: visibleBody || body,
      cid,
      from,
      status: "sent",
      t,
      encrypted_message_type,
    };

    store.dispatch(addMessage(mObject));
    store.dispatch(
      updateLastMessageField({ cid, resaveLastMessageId: mid, msg: mObject })
    );
    store.dispatch(removeMessage(mid));
  }

  async sendEncryptedMessage(message, opponentId) {
    const { ciphertext, message_type } = encryptionService.encryptMessage(
      message.body,
      opponentId
    );

    message.visibleBody = message.body;
    message.body = ciphertext;
    message.encrypted_message_type = message_type;

    await this.sendMessage(message);
  }

  saveMessagesToLocalStorage() {
    const messages = Object.values(store.getState().messages.entities);

    encryptionService
      .encrypteDataForLocalStore(messages)
      .then((encryptedData) => localforage.setItem("messages", encryptedData));

    return undefined;
  }

  async restoreMessagesFromLocalStorage() {
    const messagesCipheratext = await localforage.getItem("messages");

    const decryptedMessages = await encryptionService.decryptDataFromLocalStore(
      messagesCipheratext
    );

    const conversations = Object.values(
      decryptedMessages.reduce((acc, message) => {
        if (!message.cid) {
          return acc;
        }
        if (!acc[message.cid]) {
          acc[message.cid] = { _id: message.cid, messagesIds: [] };
        }
        acc[message.cid].messagesIds.push(message._id);
        return acc;
      }, {})
    );

    store.dispatch(addMessages(decryptedMessages));
    store.dispatch(insertChats(conversations));
  }
}

const messagesService = new MessagesService();

window.onbeforeunload = messagesService.saveMessagesToLocalStorage;

export default messagesService;
