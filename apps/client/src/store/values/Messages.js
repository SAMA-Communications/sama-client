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
      const mids = action.payload
        .filter((id) => !!state.entities[id])
        .map((id) => {
          return { _id: id, status: "read" };
        });
      messagesAdapter.upsertMany(state, mids);
    },
    removeMessage: messagesAdapter.removeOne,
    removeMessages: messagesAdapter.removeMany,
  },
});

export const selectActiveConversationMessages = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    return conversation?.messagesIds?.map((id) => messages[id]) || [];
  }
);
export const selectActiveConversationMessagesEntities = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    if (!conversation?.messagesIds) return {};

    const result = {};
    const notVisibleMessages = {};

    for (const mid of conversation.messagesIds) {
      const message = messages[mid];
      if (!message) continue;
      result[mid] = message;

      const repliedId = message.replied_message_id;
      if (
        repliedId &&
        !result[repliedId] &&
        !notVisibleMessages[repliedId] &&
        messages[repliedId]
      ) {
        notVisibleMessages[repliedId] = messages[repliedId];
      }
    }

    result.not_visible_messages = notVisibleMessages;
    return result;
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
  markMessagesAsRead,
  removeMessage,
  removeMessages,
} = messages.actions;

export default messages.reducer;
