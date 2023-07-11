import api from "../api/api";
import store from "../store/store";
import { addMessages, upsertMessages } from "../store/Messages";
import { getDownloadFileLinks } from "../api/download_manager";
import { upsertChat } from "../store/Conversations";

class MessagesService {
  async syncData(chatId) {
    api.messageList({ cid: chatId, limit: 20 }).then(async (arr) => {
      const messagesIds = arr.map((el) => el._id).reverse();
      store.dispatch(addMessages(arr));
      store.dispatch(
        upsertChat({
          _id: chatId,
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

const selectCurrentChatId = (state) => state.selectedConversation.value.id;

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = selectCurrentChatId(store.getState());

  if (currentValue && (!previousValue || previousValue !== currentValue)) {
    messagesService.syncData(currentValue);
  }
}
store.subscribe(handleChange);

export default messagesService;
