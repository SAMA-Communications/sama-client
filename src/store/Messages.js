import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
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
    upsertMessages: messagesAdapter.upsertMany,
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
  upsertMessages,
  removeMessage,
} = messages.actions;

export default messages.reducer;
