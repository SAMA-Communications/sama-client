import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import api from "../api/api";
import { getConverastionById } from "./Conversations";

export const messagesAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) => a.t - b.t,
});

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectEntities: selectMessagesEntities,
  selectIds: selectMessagesIds,
  selectTotal: selectTotalMessages,
} = messagesAdapter.getSelectors((state) => state.messages);

export const messages = createSlice({
  name: "Messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    upsertMessage: messagesAdapter.upsertOne,
    markMessagesAsRead: (state, action) => {
      const mids = action.payload.map((id) => {
        return { _id: id, status: "read" };
      });
      messagesAdapter.upsertMany(state, mids);
    },
    removeMessage: messagesAdapter.removeOne,
  },
});

export const getActiveConversationMessages = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    return conversation?.messagesIds.map((id) => messages[id]);
  }
);

export const {
  addMessage,
  addMessages,
  upsertMessage,
  markMessagesAsRead,
  removeMessage,
} = messages.actions;

export default messages.reducer;
