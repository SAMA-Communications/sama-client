import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";

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
// getActiveConversationMessages
export const messages = createSlice({
  name: "Messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    addMessage: messagesAdapter.addOne,
    addMessages: messagesAdapter.addMany,
    upsertMessage: messagesAdapter.upsertOne,
  },
});

const selectedConversation = (state) => state.selectedConversation.value;

const getSelectedConversationMessageIds = createSelector(
  [selectedConversation],
  (conversation) => {
    return conversation.messagesIds;
  }
);

export const getActiveConversationMessages = createSelector(
  [getSelectedConversationMessageIds, selectMessagesEntities],
  (ids, messages) => {
    return ids?.map((id) => messages[id]);
  }
);

export const { addMessage, addMessages, upsertMessage } = messages.actions;

export default messages.reducer;
