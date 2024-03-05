import {
  createEntityAdapter,
  createSelector,
  createSlice,
} from "@reduxjs/toolkit";
import { getSelectedConversationId } from "@store/values/SelectedConversation";

export const conversationsAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
  sortComparer: (a, b) =>
    (b.last_message?.t * 1000 || Date.parse(b.updated_at)) -
    (a.last_message?.t * 1000 || Date.parse(a.updated_at)),
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
  initialState: conversationsAdapter.getInitialState({ entities: null }),
  reducers: {
    setChats: (state, action) => {
      const conversations = action.payload;
      conversations.forEach((conv) => {
        conv.messagesIds = null;
      });
      conversationsAdapter.setAll(state, conversations);
    },

    insertChats: (state, action) => {
      const conversations = action.payload;
      if (!state.entities) {
        state.entities = {};
        conversationsAdapter.upsertMany(state, conversations);
        return;
      }

      const conversationsToUpdate = [];
      conversations.forEach((conv) => {
        !state.entities[conv._id] && (conv.messagesIds = null);
        conversationsToUpdate.push(conv);
      });
      if (!conversationsToUpdate.length) {
        return;
      }
      conversationsAdapter.upsertMany(state, conversationsToUpdate);
    },

    insertChat: (state, action) => {
      const conversation = action.payload;
      conversationsAdapter.setAll(state, [
        conversation,
        ...Object.values(state.entities),
      ]);
    },

    upsertChat: (state, action) => {
      const conversation = action.payload;
      if (!state.entities) {
        state.entities = {};
      }
      conversationsAdapter.upsertOne(state, conversation);
    },
    removeChat: conversationsAdapter.removeOne,

    updateLastMessageField: (state, { payload }) => {
      const { cid, msg, resaveLastMessageId, countOfNewMessages } = payload;
      const conv = state.entities[cid];

      if (!conv) {
        return;
      }
      let mids = [...conv.messagesIds];

      if (resaveLastMessageId) {
        const msgIndes = mids.indexOf(resaveLastMessageId);
        if (msgIndes !== -1) {
          mids.splice(msgIndes, 1);
        }
      }
      const updateParams = {
        _id: cid,
        messagesIds: [...mids, msg._id],
        last_message: msg,
        updated_at: new Date(msg.t * 1000).toISOString(),
      };
      if (countOfNewMessages) {
        updateParams.unread_messages_count =
          conv.unread_messages_count + countOfNewMessages;
      }

      conversationsAdapter.upsertOne(state, updateParams);
    },

    upsertParticipants: (state, { payload }) => {
      const { cid, participants } = payload;
      const conv = state.entities[cid];

      if (!conv) {
        return;
      }
      const updateParams = { _id: cid, participants };

      conversationsAdapter.upsertOne(state, updateParams);
    },
    setLastMessageField: (state, { payload }) => {
      const { cid, msg } = payload;
      const conv = state.entities[cid];

      if (!conv) {
        return;
      }
      const updateParams = {
        _id: cid,
        last_message: msg,
        updated_at: new Date(msg.t * 1000).toISOString(),
      };
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
  clearCountOfUnreadMessages,
  insertChats,
  insertChat,
  markConversationAsRead,
  removeChat,
  setChats,
  setLastMessageField,
  updateChatIndicator,
  updateLastMessageField,
  upsertChat,
  upsertParticipants,
} = conversations.actions;

export default conversations.reducer;
