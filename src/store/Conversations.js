import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { getSelectedConversationId } from "./SelectedConversation";

export const conversationsAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) => {
    if (!a.last_message) {
      return 1;
    }
    if (!b.last_message) {
      return -1;
    }
    return b.last_message?.t - a.last_message?.t;
  },
});

export const {
  selectAll: selectAllConversations,
  selectEntities: selectConversationsEntities,
  selectIds: selectConversationsIds,
  selectTotal: selectTotalConversations,
} = conversationsAdapter.getSelectors((state) => state.conversations);

export const getConverastionById = createSelector(
  [getSelectedConversationId, selectConversationsEntities],
  (id, conversations) => {
    return conversations[id];
  }
);

export const conversations = createSlice({
  name: "Conversations",
  initialState: conversationsAdapter.getInitialState(),
  reducers: {
    setChats: (state, action) => {
      const conversations = action.payload;
      conversations.forEach((conv) => {
        conv.messagesIds = [];
      });
      conversationsAdapter.setAll(state, conversations);
    },
    updateChatIndicator: (state) => {
      conversationsAdapter.updateOne();
    },
    upsertChat: conversationsAdapter.upsertOne,
    removeChat: conversationsAdapter.removeOne,
  },
});

export const { setChats, updateChatIndicator, upsertChat, removeChat } =
  conversations.actions;

export default conversations.reducer;
