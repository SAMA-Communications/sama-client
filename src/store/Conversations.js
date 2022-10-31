import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const conversationsAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) => a._id.localeCompare(b._id),
});

export const {
  selectAll: selectAllConversations,
  selectById: selectConversationByCid,
  selectEntities: selectConversationsEntities,
  selectIds: selectConversationsIds,
  selectTotal: selectTotalConversations,
} = conversationsAdapter.getSelectors((state) => state.conversations);

export const conversations = createSlice({
  name: "Conversations",
  initialState: conversationsAdapter.getInitialState(),
  reducers: {
    setChats: conversationsAdapter.setAll,
    upsertChat: conversationsAdapter.upsertOne,
    removeChat: conversationsAdapter.removeOne,
  },
});

export const { setChats, upsertChat, removeChat } = conversations.actions;

export default conversations.reducer;
