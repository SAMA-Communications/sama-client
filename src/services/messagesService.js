import DownloadManager from "@adapters/downloadManager";
import api from "@api/api";
import jwtDecode from "jwt-decode";
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
import { history } from "@helpers/history";
import {
  markConversationAsRead,
  updateLastMessageField,
  upsertChat,
  upsertParticipants,
} from "@store/values/Conversations";

class MessagesService {
  currentChatId;

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

      let countOfNewMessages = 0;
      message.cid === this.currentChatId
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
            participants: [...conv.participants, user._id],
          })
        );
      }
      if (conv && message.x?.type === "removed_participant") {
        const user = message.x.user;
        store.dispatch(
          upsertChat({
            _id: message.cid,
            participants: conv.participants.filter((uId) => uId !== user._id),
          })
        );
      }
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
    api
      .messageList({
        cid: this.currentChatId,
        limit: +process.env.REACT_APP_MESSAGES_COUNT_TO_PRELOAD,
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
              includes: ["id"],
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
        store.dispatch(setSelectedConversation({}));
        history.navigate("/");
      });
  }

  async sendMessage(message) {
    const { server_mid, t } = await api.messageCreate(message);
    const { mid, body, cid, from } = message;

    const mObject = { _id: server_mid, body, from, status: "sent", t };

    store.dispatch(addMessage(mObject));
    store.dispatch(
      updateLastMessageField({ cid, resaveLastMessageId: mid, msg: mObject })
    );
    store.dispatch(removeMessage(mid));
  }
}

const messagesService = new MessagesService();

export default messagesService;
