import DownloadManager from "@adapters/downloadManager";
import api from "@api/api";
import encryptionService from "./encryptionService";
import garbageCleaningService from "./garbageCleaningService";
import indexedDB from "@store/indexedDB";
import jwtDecode from "jwt-decode";
import navigateTo from "@utils/navigation/navigate_to";
import store from "@store/store";
import { addUser } from "@store/values/Participants";
import {
  addMessage,
  addMessages,
  removeMessage,
  selectActiveConversationMessages,
  updateMessagesStatus,
  upsertMessage,
  upsertMessages,
} from "@store/values/Messages";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import {
  markConversationAsRead,
  removeChat,
  removeMessagesFromConversation,
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
      indexedDB.upsertEncryptionMessage(message._id, decryptedMessage);
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
      indexedDB.updateMessagesStatus(message.ids, "read");
      store.dispatch(
        updateMessagesStatus({ mids: message.ids, status: "read" })
      );
      store.dispatch(
        markConversationAsRead({
          cid: message.cid,
          mid: Array.isArray(message.ids) ? message.ids[0] : message.ids,
        })
      );
    };

    api.onMessageDecryptionFailedListener = (message) => {
      indexedDB.updateMessagesStatus(message.ids, "decryption_failed");
      store.dispatch(
        updateMessagesStatus({ mids: message.ids, status: "decryption_failed" })
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
      await indexedDB.addMessage(message);
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
      if (conv.is_encrypted && !message.x) {
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
        garbageCleaningService.clearConversationMessages(previousValue);
      }
    });
  }

  processAttachments(messages) {
    const attachments = messages.reduce((acc, msg) => {
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
    return attachments;
  }

  async retrieveAttachmentsLinks(attachments) {
    if (Object.keys(attachments).length > 0) {
      const msgs = await DownloadManager.getDownloadFileLinks(attachments);
      const messagesToUpdate = msgs.flatMap((msg) =>
        (Array.isArray(msg._id) ? msg._id : [msg._id]).map((mid) => ({
          ...msg,
          _id: mid,
        }))
      );
      store.dispatch(upsertMessages(messagesToUpdate));
    }
  }

  handleRetrievedMessages(messages) {
    const messagesIds = messages.map((el) => el._id).reverse();
    const messagesReduxIds = (
      selectActiveConversationMessages(store.getState()) || []
    ).map((el) => el._id);

    const uniqueMessageIds = [
      ...new Set([
        ...messagesIds.filter((el) => !messagesReduxIds.includes(el)),
        ...messagesReduxIds,
      ]),
    ];

    store.dispatch(addMessages(messages));
    store.dispatch(
      upsertChat({
        _id: this.currentChatId,
        messagesIds: uniqueMessageIds,
        activated: true,
      })
    );

    const mAttachments = this.processAttachments(messages);
    this.retrieveAttachmentsLinks(mAttachments);

    return messages;
  }

  async retrieveMessages(params) {
    const messagesDB = await indexedDB.getMessages(params);

    const lastExistMessage = messagesDB[0];
    if (lastExistMessage) {
      params.updated_at = {
        gt:
          lastExistMessage.created_at ||
          new Date(lastExistMessage.t * 1000).toISOString(),
      };
    }

    const messagesAPI = await api.messageList(params);
    await indexedDB.insertManyMessages(messagesAPI);

    const jointMessages = [...messagesAPI, ...messagesDB];
    const returnedMessages = this.handleRetrievedMessages(jointMessages);

    for (const message of messagesAPI.reverse()) {
      if (message.encrypted_message_type !== undefined)
        await this.#tryToCreateESession(message);
    }

    return returnedMessages;
  }

  async syncData() {
    const cid = this.currentChatId;
    const params = {
      cid,
      limit: +process.env.REACT_APP_MESSAGES_COUNT_TO_PRELOAD,
    };

    const allConversationMessages = Object.values(
      selectActiveConversationMessages(store.getState()) || {}
    );
    const lastMessage = allConversationMessages.splice(-1)[0];

    if (lastMessage) {
      params.updated_at = {
        gt:
          lastMessage.created_at ||
          new Date(lastMessage.t * 1000).toISOString(),
      };
    }

    try {
      if (allConversationMessages.length >= params.limit) return;

      await this.retrieveMessages(params);

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
    } catch (error) {
      console.log(error);
      store.dispatch(removeChat(cid));
      store.dispatch(setSelectedConversation({}));
      navigateTo("/");
    }
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
      created_at: new Date(t).toISOString(),
    };

    await indexedDB.addMessage(mObject);
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

  async removeMessageFromLocalStore(mid, cid) {
    store.dispatch(removeMessagesFromConversation({ mid, cid }));
    store.dispatch(removeMessage(mid));
    await indexedDB.removeMessage(mid);
  }
}

const messagesService = new MessagesService();

export default messagesService;
