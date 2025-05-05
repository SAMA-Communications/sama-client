import jwtDecode from "jwt-decode";

import api from "@api/api";

import store from "@store/store";
import { upsertUser } from "@store/values/Participants";

import getLastVisitTime from "@utils/user/get_last_visit_time";
class ActivityService {
  currentChatId;
  activeChat;
  isFirstSync = true;

  constructor() {
    api.onUserActivityListener = (user) => {
      const uId = Object.keys(user)[0];
      store.dispatch(upsertUser({ _id: uId, recent_activity: user[uId] }));
    };

    store.subscribe(() => {
      const state = store.getState();
      const { conversations, participants, selectedConversation } = state;
      const { entities } = conversations;
      const selectedConversationId = selectedConversation.value.id;

      if (
        !entities ||
        !entities[selectedConversationId]?.created_at ||
        !participants.ids.length ||
        this.currentChatId === selectedConversationId
      ) {
        return;
      }

      this.currentChatId = selectedConversationId;
      this.activeChat = entities[this.currentChatId] || {};
      this.isFirstSync && (this.isFirstSync = false);
      if (this.activeChat.type !== "u") {
        return;
      }

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

  getUserLastActivity(userId) {
    const opponentLastActivity =
      store.getState().participants.entities[userId]?.recent_activity;
    return opponentLastActivity === "online" ? (
      <span className="text-(--color-accent-dark) text-h5">online</span>
    ) : (
      getLastVisitTime(opponentLastActivity)
    );
  }
}

const activityService = new ActivityService();

export default activityService;
