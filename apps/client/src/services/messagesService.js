import jwtDecode from "jwt-decode";

import api from "@api/api";
import DownloadManager from "@lib/downloadManager";

import store from "@store/store";
import { addUser } from "@store/values/Participants";
import {
  addMessage,
  addMessages,
  markMessagesAsRead,
  removeMessage,
  upsertMessages,
} from "@store/values/Messages";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import {
  markConversationAsRead,
  removeChat,
  updateLastMessageField,
  upsertChat,
  upsertParticipants,
} from "@store/values/Conversations";

import navigateTo from "@utils/navigation/navigate_to";

class MessagesService {
  currentChatId;
  typingTimers = {};

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
        const attachmentsIds = attachments
          .filter((obj) => !obj.file_url && obj.file_id)
          .map((obj) => obj.file_id);
        if (attachmentsIds.length) {
          const urls = await api.getDownloadUrlForFiles({
            file_ids: attachmentsIds,
          });
          message.attachments = attachments.map((obj) => {
            return { ...obj, file_url: urls[obj.file_id] };
          });
        }
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
    api
      .messageList({
        cid,
        limit: +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD,
      })
      .then(async (arr) => {
        const messagesIds = arr.map((el) => el._id).reverse();
        store.dispatch(addMessages(arr));
        store.dispatch(
          upsertChat({
            _id: this.currentChatId,
            messagesIds,
            activated: true,
          })
        );
        const mAttachments = {};
        for (let i = 0; i < arr.length; i++) {
          const attachments = arr[i].attachments;
          if (!attachments) {
            continue;
          }
          attachments.forEach((obj) => {
            if (obj.file_url) return;
            const mAttachmentsObject = mAttachments[obj.file_id];
            if (!mAttachmentsObject) {
              mAttachments[obj.file_id] = {
                _id: arr[i]._id,
                ...obj,
              };
              return;
            }

            const mids = mAttachmentsObject._id;
            mAttachments[obj.file_id]._id = Array.isArray(mids)
              ? [arr[i]._id, ...mids]
              : [arr[i]._id, mids];
          });
        }

        if (Object.keys(mAttachments).length > 0) {
          DownloadManager.getDownloadFileLinks(mAttachments).then((msgs) => {
            const messagesToUpdate = msgs.flatMap((msg) => {
              const mids = Array.isArray(msg._id) ? msg._id : [msg._id];
              return mids.map((mid) => ({ ...msg, _id: mid }));
            });
            store.dispatch(upsertMessages(messagesToUpdate));
          });
        }
        const conv =
          store.getState().conversations.entities[this.currentChatId];
        if (conv.type !== "u") {
          api
            .getParticipantsByCids({
              cids: [this.currentChatId],
            })
            .then((arr) =>
              store.dispatch(
                upsertParticipants({
                  cid: this.currentChatId,
                  participants: arr.map((obj) => obj._id),
                })
              )
            );
        }
      })
      .catch(() => {
        store.dispatch(removeChat(cid));
        store.dispatch(setSelectedConversation({}));
        navigateTo("/");
      });
  }

  async sendMessage(message) {
    const { server_mid, t, modified, bot_message } = await api.messageCreate(
      message
    );
    const { mid, body, cid, from, attachments } = message;
    const mObject = {
      _id: server_mid,
      old_id: mid,
      body: modified?.body || body,
      attachments: modified?.attachments || attachments,
      from,
      status: "sent",
      t,
    };

    store.dispatch(addMessage(mObject));
    store.dispatch(
      updateLastMessageField({ cid, resaveLastMessageId: mid, msg: mObject })
    );
    store.dispatch(removeMessage(mid));

    if (bot_message) {
      const participants = store.getState().participants;
      if (!participants[bot_message.from]) {
        const botObject = await api.getUsersByIds({ ids: [bot_message.from] });
        store.dispatch(addUser(botObject[0]));
      }
      store.dispatch(addMessage(bot_message));
      store.dispatch(updateLastMessageField({ cid, msg: bot_message }));
    }

    return mObject;
  }
}

const messagesService = new MessagesService();

export default messagesService;
