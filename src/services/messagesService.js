import api from "../api/api";
import store from "../store/store";
import { addMessages, upsertMessages } from "../store/Messages";
import { getDownloadFileLinks } from "../api/download_manager";
import { setSelectedConversation } from "../store/SelectedConversation";
import { upsertChat, upsertParticipants } from "../store/Conversations";
import { history } from "../_helpers/history";

class MessagesService {
  currentChatId;

  constructor() {
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
          attachments.forEach(
            (obj) =>
              (mAttachments[obj.file_id] = {
                _id: arr[i]._id,
                ...obj,
              })
          );
        }

        if (Object.keys(mAttachments).length > 0) {
          getDownloadFileLinks(mAttachments).then((msgs) =>
            store.dispatch(upsertMessages(msgs))
          );
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
        history.navigate("/main");
      });
  }
}

const messagesService = new MessagesService();

export default messagesService;
