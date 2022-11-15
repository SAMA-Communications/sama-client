import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { getSelectedConversationId } from "./SelectedConversation";

export const conversationsAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) => {
    if (!b.lastMessage) {
      return -1;
    }
    if (!a.lastMessage) {
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
    upsertChat: conversationsAdapter.upsertOne,
    removeChat: conversationsAdapter.removeOne,
  },
});

export const getConverastionById = createSelector(
  [getSelectedConversationId, selectConversationsEntities],
  (id, conversations) => {
    return conversations[id];
  }
);

export const { setChats, upsertChat, removeChat } = conversations.actions;

export default conversations.reducer;
