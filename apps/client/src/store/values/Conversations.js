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
    return conversations && id ? conversations[id] : {};
  }
);

export const getDisplayableConversations = createSelector(
  [selectAllConversations],
  (conversations) => {
    return conversations.filter((obj) => obj.type === "g" || obj.last_message);
  }
);

export const getConversationHandler = createSelector(
  [getSelectedConversationId, selectConversationsEntities],
  (id, conversations) => {
    return conversations && id ? conversations[id].handler_options : null;
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
        if (!state.entities[conv._id]) {
          conv.messagesIds = null;
        }
        delete conv.participants;
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

      const { messagesIds, unread_messages_count } =
        state.entities[conversation._id] || {};
      // messagesIds && delete conversation.messagesIds;
      unread_messages_count && delete conversation.unread_messages_count;

      conversationsAdapter.upsertOne(state, conversation);
    },
    removeChat: conversationsAdapter.removeOne,

    updateLastMessageField: (state, { payload }) => {
      const { cid, msg, resaveLastMessageId, countOfNewMessages } = payload;
      const conv = state.entities[cid];

      const updateParams = {
        _id: cid,
        messagesIds: [msg._id],
        last_message: msg,
        updated_at: new Date(msg.t * 1000).toISOString(),
      };

      if (!conv) {
        countOfNewMessages &&
          (updateParams.unread_messages_count = countOfNewMessages);
        conversationsAdapter.upsertOne(state, updateParams);
        return;
      }

      let mids = [...(conv?.messagesIds || [])];

      if (resaveLastMessageId) {
        const msgIndes = mids.indexOf(resaveLastMessageId);
        if (msgIndes !== -1) {
          mids.splice(msgIndes, 1);
        }
      }

      updateParams.messagesIds = [...mids, msg._id];
      if (countOfNewMessages) {
        updateParams.unread_messages_count =
          (conv.unread_messages_count || 0) + countOfNewMessages;
      }

      conversationsAdapter.upsertOne(state, updateParams);
    },
    updateWithDrafts: (state, { payload }) => {
      const { cid, isRemove = false, draft } = payload;
      const conv = state.entities[cid];

      const updateParams = { _id: cid };

      if (conv.last_message) {
        updateParams.last_message = {
          ...conv.last_message,
          ...(isRemove
            ? { t: conv.last_message.old_t, old_t: null }
            : { t: draft.updated_at, old_t: conv.last_message.t }),
        };
        if (isRemove) {
          updateParams.draft = null;
        } else if (draft) {
          updateParams.draft = draft.message;
        }
      } else {
        if (isRemove) {
          updateParams.updated_at = conv.old_updated_at;
          updateParams.old_updated_at = null;
          updateParams.draft = null;
        } else {
          updateParams.updated_at = draft.updated_at;
          updateParams.old_updated_at = conv.updated_at;
          if (draft) {
            updateParams.draft = draft.message;
          }
        }
      }

      conversationsAdapter.upsertOne(state, updateParams);
    },

    removeLastMessage: (state, { payload }) => {
      const { cid } = payload;
      const conv = state.entities[cid];

      if (!conv) return;

      const updateParams = {
        _id: cid,
        messagesIds: conv.messagesIds.slice(0, -1),
      };
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
        updated_at: msg
          ? new Date(msg.t * 1000).toISOString()
          : conv.created_at,
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

      const conv = state.entities[cid];
      if (!conv) {
        return;
      }

      const lastMessageField = conv.last_message;
      mid === lastMessageField._id &&
        conversationsAdapter.upsertOne(state, {
          _id: cid,
          last_message: { ...lastMessageField, status: "read" },
        });
    },

    updateHandler: (state, action) => {
      const { _id, content, updated_at, updated_by, not_saved } =
        action.payload;
      const conv = state.entities[_id];

      const existingHandlerOptions = conv?.handler_options || {};
      const updatedHandlerOptions = {
        ...existingHandlerOptions,
        ...(content && { content }),
        ...(updated_at && { updated_at }),
        ...(updated_by && { updated_by }),
        not_saved,
      };

      conversationsAdapter.upsertOne(state, {
        _id: _id,
        handler_options: updatedHandlerOptions,
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
  removeLastMessage,
  setChats,
  setLastMessageField,
  updateChatIndicator,
  updateLastMessageField,
  updateWithDrafts,
  upsertChat,
  upsertParticipants,
  updateHandler,
  deleteScheme,
} = conversations.actions;

export default conversations.reducer;
