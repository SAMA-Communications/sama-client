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
    upsertChat: conversationsAdapter.upsertOne,
    removeChat: conversationsAdapter.removeOne,

    updateLastMessageField: (state, { payload }) => {
      const { cid, msg, resaveLastMessage, countOfNewMessages } = payload;
      const conv = state.entities[cid];
      let mids = [...conv.messagesIds];

      if (resaveLastMessage) {
        mids.pop();
      }
      const updateParams = {
        _id: cid,
        messagesIds: [...mids, msg._id],
        last_message: msg,
        update_at: new Date(msg.t * 1000).toISOString(),
      };
      if (countOfNewMessages) {
        updateParams.unread_messages_count =
          conv.unread_messages_count + countOfNewMessages;
      }

      conversationsAdapter.upsertOne(state, updateParams);
    },
    clearCountOfUnreadMessages: (state, action) => {
      const cid = action.payload;
      conversationsAdapter.upsertOne(state, {
        _id: cid,
        unread_messages_count: 0,
      });
    },
    markConversationAsRead: (state, { payload }) => {
      const { cid, mid } = payload;
      const lastMessageField = state.entities[cid].last_message;
      mid === lastMessageField._id &&
        conversationsAdapter.upsertOne(state, {
          _id: cid,
          last_message: { ...lastMessageField, status: "read" },
        });
    },
  },
});

export const {
  setChats,
  updateChatIndicator,
  upsertChat,
  removeChat,
  markConversationAsRead,
  clearCountOfUnreadMessages,
  updateLastMessageField,
} = conversations.actions;

export default conversations.reducer;
