import api from "../api/api";
import jwtDecode from "jwt-decode";
import store from "../store/store";
import { upsertUser } from "../store/Participants";

class ActivityService {
  currentChatId;
  activeChat;
  allUsers;

  constructor() {
    api.onUserActivityListener = (user) => {
      const uId = Object.keys(user)[0];
      store.dispatch(upsertUser({ _id: uId, recent_activity: user[uId] }));
    };

    store.subscribe(() => {
      const { conversations, participants, selectedConversation } =
        store.getState();
      const selectedConversationId = selectedConversation.value.id;

      if (
        !conversations.entities[selectedConversationId]?.created_at ||
        !participants.ids.length ||
        this.currentChatId === selectedConversationId
      ) {
        return;
      }

      this.currentChatId = selectedConversationId;
      this.activeChat = conversations.entities[this.currentChatId];
      if (this.activeChat.type !== "u") {
        return;
      }

      this.allUsers = participants.entities;
      this.syncData();
    });
  }

  async syncData() {
    const userInfo = localStorage.getItem("sessionId")
      ? jwtDecode(localStorage.getItem("sessionId"))
      : null;

    if (!userInfo) {
      return;
    }

    const uId =
      this.activeChat.owner_id === userInfo._id
        ? this.activeChat.opponent_id
        : this.activeChat.owner_id;

    if (!uId) {
      return;
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
