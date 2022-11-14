import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { getConverastionById } from "./Conversations";

export const messagesAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) => a._id.localeCompare(b._id),
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
    removeMessage: messagesAdapter.removeOne,
  },
});

export const getActiveConversationMessages = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    return conversation?.messagesIds.map((id) => messages[id]);
  }
);

export const { addMessage, addMessages, upsertMessage, removeMessage } =
  messages.actions;

export default messages.reducer;
