import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import jwtDecode from "jwt-decode";
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
    removeMessage: messagesAdapter.removeOne,
  },
});

export const getActiveConversationMessages = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    return conversation?.messagesIds.map((id) => messages[id]);
  }
);

export const getUnreadMessagesIds = createSelector(
  [getConverastionById, selectMessagesEntities],
  (conversation, messages) => {
    const resultArray = [];
    const userInfo = localStorage.getItem("sessionId")
      ? jwtDecode(localStorage.getItem("sessionId"))
      : null;
    if (conversation) {
      for (const id of conversation.messagesIds) {
        if (!messages[id].read && messages[id].from !== userInfo._id) {
          resultArray.push(id);
        }
      }
    }
    return resultArray;
  }
);

export const { addMessage, addMessages, upsertMessage, removeMessage } =
  messages.actions;

export default messages.reducer;
