import api from "../api/api";
import store from "../store/store";
import { addMessages, upsertMessages } from "../store/Messages";
import { getDownloadFileLinks } from "../api/download_manager";
import { upsertChat } from "../store/Conversations";

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
      .messageList({ cid: this.currentChatId, limit: 20 })
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
      });
  }
}

const messagesService = new MessagesService();

export default messagesService;