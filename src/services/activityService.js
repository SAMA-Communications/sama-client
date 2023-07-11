import api from "../api/api";
import jwtDecode from "jwt-decode";
import store from "../store/store";
import { upsertUser } from "../store/Participants";

class MessagesService {
  async syncData(chat, users) {
    const userInfo = localStorage.getItem("sessionId")
      ? jwtDecode(localStorage.getItem("sessionId"))
      : null;

    if (!userInfo) {
      return null;
    }

    const uId =
      chat.owner_id === userInfo._id
        ? users[chat.opponent_id]?._id
        : users[chat.owner_id]?._id;

    if (!uId) {
      return null;
    }

    api.subscribeToUserActivity(uId).then((activity) => {
      store.dispatch(
        upsertUser({
          _id: uId,
          recent_activity: activity[uId],
        })
      );
    });
  }
}

const messagesService = new MessagesService();

const selectCurrentChatId = (state) => state.selectedConversation.value.id;
const selectConversationById = (state, id) => state.conversations.entities[id];
const selectAllUsers = (state) => state.participants.entities;

let currentValue;
function handleChange() {
  let previousValue = currentValue;
  const storeObj = store.getState();
  currentValue = selectCurrentChatId(storeObj);

  if (!currentValue || previousValue === currentValue) {
    return;
  }

  const chat = selectConversationById(storeObj, currentValue);
  if (chat?.type !== "u") {
    return;
  }

  const users = selectAllUsers(storeObj);
  messagesService.syncData(chat, users);
}
store.subscribe(handleChange);

export default messagesService;
