import api from "../api/api";
import jwtDecode from "jwt-decode";
import store from "../store/store";
import { upsertUser } from "../store/Participants";

class ActivityService {
  currentChatId;
  activeChat;
  allUsers;

  constructor() {
    store.subscribe(() => {
      const storeObj = store.getState();

      if (
        !storeObj.conversations.entities[storeObj.selectedConversation.value.id]
          ?.created_at ||
        !storeObj.participants.ids.length
      ) {
        return;
      }

      let previousValue = this.currentChatId;
      this.currentChatId = storeObj.selectedConversation.value.id;

      if (!this.currentChatId || previousValue === this.currentChatId) {
        return;
      }

      this.activeChat = storeObj.conversations.entities[this.currentChatId];
      if (this.activeChat?.type !== "u") {
        return;
      }

      this.allUsers = storeObj.participants.entities;
      this.syncData();
    });
  }

  async syncData() {
    console.log(1);
    const userInfo = localStorage.getItem("sessionId")
      ? jwtDecode(localStorage.getItem("sessionId"))
      : null;

    if (!userInfo) {
      return null;
    }
    console.log(2);

    const uId =
      this.activeChat.owner_id === userInfo._id
        ? this.activeChat.opponent_id
        : this.activeChat.owner_id;

    console.log(
      this.allUsers,
      this.activeChat.opponent_id,
      this.activeChat.owner_id,
      this.allUsers[this.activeChat.opponent_id]?._id,
      this.allUsers[this.activeChat.owner_id]?._id
    );
    if (!uId) {
      return null;
    }
    console.log(3);

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

const activityService = new ActivityService();

export default activityService;
