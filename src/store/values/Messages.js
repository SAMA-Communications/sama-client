import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { getConverastionById } from "@store/values/Conversations";

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
    markMessagesAsRead: (state, action) => {
      const upsertParams = action.payload
        .filter((id) => !!state.entities[id])
        .map((id) => ({ _id: id, status: "read" }));
      messagesAdapter.upsertMany(state, upsertParams);
    },
    markDecryptionFailedMessages: (state, action) => {
      const upsertParams = action.payload
        .filter((id) => !!state.entities[id])
        .map((id) => ({ _id: id, status: "decryption_failed" }));
      messagesAdapter.upsertMany(state, upsertParams);
    },
    clearMessagesToLocalLimit: (state, { payload }) => {
      const messageIds = Object.values(state.entities)
        .filter((message) => message.cid === payload)
        .splice(30)
        .map((message) => message._id);

      messagesAdapter.removeMany(state, messageIds);
    },
    removeMessage: messagesAdapter.removeOne,
  },
});

export const selectActiveConversationMessages = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    return conversation?.messagesIds?.map((id) => messages[id]);
  }
);

const getId = (_, id) => id;

export const getMessageById = createSelector(
  [selectMessagesEntities, getId],
  (messages, id) => messages[id]
);

export const {
  addMessage,
  addMessages,
  upsertMessage,
  upsertMessages,
  upsertMessageStatuses,
  markMessagesAsRead,
  markDecryptionFailedMessages,
  removeMessage,
  clearMessagesToLocalLimit,
} = messages.actions;

export default messages.reducer;
