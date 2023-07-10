import api from "../api/api";
import store from "../store/store";
import { insertChats } from "../store/Conversations";

class ConversationsService {
  async syncData() {
    api
      .conversationList({})
      .then((chats) => store.dispatch(insertChats(chats)));
  }
}

const conversationService = new ConversationsService();

const select = (state) => state.userAuth.value;

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  currentValue = select(store.getState());

  if (currentValue && !previousValue) {
    conversationService.syncData();
  }
}
store.subscribe(handleChange);

export default conversationService;
