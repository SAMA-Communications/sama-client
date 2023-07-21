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
      let previousValue = this.currentChatId;
      const storeObj = store.getState();
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
    const userInfo = localStorage.getItem("sessionId")
      ? jwtDecode(localStorage.getItem("sessionId"))
      : null;

    if (!userInfo) {
      return null;
    }

    const uId =
      this.activeChat.owner_id === userInfo._id
        ? this.allUsers[this.activeChat.opponent_id]?._id
        : this.allUsers[this.activeChat.owner_id]?._id;

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

const activityService = new ActivityService();

export default activityService;
