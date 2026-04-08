import api from "@api/api";

import store from "@store/store";
import { upsertUser } from "@store/values/Participants";

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

  async fetchAndApplyUserActivity(uId, isCancelled = () => false) {
    if (!uId) return;

    try {
      const activity = await api.subscribeToUserActivity(uId);
      if (isCancelled()) return;

      store.dispatch(
        upsertUser({
          _id: uId,
          recent_activity: activity[uId],
        }),
      );
    } catch {}
  }

  async syncData() {
    const state = store.getState();
    const currentUserId = state.currentUserId.value.id;
    if (!currentUserId) return;

    const activeConv = this.activeChat;
    const uId = String(activeConv.owner_id) === String(currentUserId) ? activeConv.opponent_id : activeConv.owner_id;
    if (!uId) return;

    await this.fetchAndApplyUserActivity(uId);
  }

  isSelectedPrivateChatWithUser(profileUserId) {
    if (!profileUserId) return false;

    const state = store.getState();
    const currentUserId = state.currentUserId.value.id;
    if (!currentUserId) return false;

    const selectedConversationId = state.selectedConversation.value.id;
    if (!selectedConversationId) return false;

    const chat =
      this.currentChatId != null && String(this.currentChatId) === String(selectedConversationId)
        ? this.activeChat
        : state.conversations.entities[selectedConversationId];
    if (!chat?.created_at || chat.type !== "u") return false;

    const opponentId = String(chat.owner_id) === String(currentUserId) ? chat.opponent_id : chat.owner_id;
    if (opponentId == null) return false;

    return String(opponentId) === String(profileUserId);
  }

  unsubscribeProfileActivityIfNeeded(profileUserId) {
    if (!this.isSelectedPrivateChatWithUser(profileUserId)) {
      return api.unsubscribeFromUserActivity({});
    }
  }
}

const activityService = new ActivityService();

export default activityService;
