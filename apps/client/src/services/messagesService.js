import jwtDecode from "jwt-decode";

import api from "@api/api";

import DownloadManager from "@lib/downloadManager";

import store from "@store/store";
import {
  markConversationAsRead,
  removeChat,
  updateLastMessageField,
  upsertChat,
  upsertParticipants,
  setLastMessageField,
} from "@store/values/Conversations";
import {
  addMessage,
  addMessages,
  markMessagesAsRead,
  removeMessage,
  removeMessages,
  upsertMessage,
  upsertMessages,
} from "@store/values/Messages";
import { addUser, upsertUsers } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";

import conversationService from "@services/conversationsService";

import { TYPING_DURATION_MS } from "@utils/constants.js";
import { navigateTo } from "@utils/NavigationUtils.js";

function getMessageSortKey(msg) {
  if (!msg || typeof msg !== "object") return 0;
  if (typeof msg.t === "number") return msg.t;
  if (msg.created_at != null) {
    const ms = Date.parse(msg.created_at);
    if (!Number.isNaN(ms)) return ms / 1000;
  }
  if (msg.updated_at != null) {
    const ms = Date.parse(msg.updated_at);
    if (!Number.isNaN(ms)) return ms / 1000;
  }
  return 0;
}

function mergeChronologicalMessageIds(oldIds, incomingIds, entities) {
  const set = new Set([...(oldIds || []), ...incomingIds]);
  const list = [...set];
  list.sort((a, b) => {
    const ka = getMessageSortKey(entities[a]);
    const kb = getMessageSortKey(entities[b]);
    if (ka !== kb) return ka - kb;
    return String(a).localeCompare(String(b));
  });
  return list;
}

class MessagesService {
  currentChatId;
  typingTimers = {};

  constructor() {
    this.updateConversationAfterDeleteMessages = (cid, mids) => {
      const conversation = store.getState().conversations.entities?.[cid];
      if (conversation) {
        const oldMessagesIds = conversation.messagesIds || [];
        const isUpdateLastMessage = mids.includes(oldMessagesIds.at(-1));
        const newMessagesIds = oldMessagesIds.filter((mid) => !mids.includes(mid));
        store.dispatch(upsertChat({ _id: cid, messagesIds: newMessagesIds }));
        if (isUpdateLastMessage) {
          const lastMessage = store.getState().messages.entities?.[newMessagesIds.at(-1)];
          store.dispatch(setLastMessageField({ cid, msg: lastMessage }));
        }
      }
    };

    api.onMessageStatusListener = (message) => {
      store.dispatch(markMessagesAsRead(message.ids));
      store.dispatch(
        markConversationAsRead({
          cid: message.cid,
          mid: Array.isArray(message.ids) ? message.ids[0] : message.ids,
        }),
      );
    };

    api.onMessageListener = async (message) => {
      const cid = message.cid;
      if (cid && !store.getState().conversations.entities?.[cid]?._id) {
        await conversationService.ensureConversationInStoreIfMissing(cid);
      }

      const attachments = message.attachments;
      if (attachments) {
        const attachmentsIds = attachments.filter((obj) => !obj.file_url && obj.file_id).map((obj) => obj.file_id);
        if (attachmentsIds.length) {
          const urls = await api.getDownloadUrlForFiles({
            file_ids: attachmentsIds,
          });
          message.attachments = attachments.map((obj) => {
            return { ...obj, file_url: urls[obj.file_id] };
          });
        }
      }

      const userInfo = jwtDecode(localStorage.getItem("sessionId"));
      message.from === userInfo._id && (message["status"] = "sent");
      store.dispatch(addMessage(message));

      this.typingTimers[message.cid]?.clearTypingStatus &&
        clearTimeout(this.typingTimers[message.cid].clearTypingStatus);
      store.dispatch(upsertChat({ _id: message.cid, typing_users: null }));

      let countOfNewMessages = 0;
      message.cid === this.currentChatId && document.hasFocus()
        ? api.markConversationAsRead({ cid: this.currentChatId })
        : (countOfNewMessages = message.from === userInfo._id ? 0 : 1);
      store.dispatch(
        updateLastMessageField({
          cid: message.cid,
          msg: message,
          countOfNewMessages,
        }),
      );

      const conv = store.getState().conversations.entities[message.cid];
      if (conv && message.x?.type === "added_participant") {
        const user = message.x.user;
        store.dispatch(addUser(user));
        store.dispatch(
          upsertChat({
            _id: message.cid,
            participants: [...(conv.participants || []), user._id],
          }),
        );
      }
      if (conv && (message.x?.type === "removed_participant" || message.x?.type === "left_participants")) {
        const user = message.x.user;
        store.dispatch(
          upsertChat({
            _id: message.cid,
            participants: conv.participants.filter((uId) => uId !== user._id),
          }),
        );
      }
    };

    api.onMessageEditListener = async (message) => {
      const { id, body } = message;
      store.dispatch(upsertMessage({ _id: id, body, updated_at: new Date().toISOString() }));
    };

    api.onMessageDeleteListener = async (message) => {
      store.dispatch(removeMessages(message.ids));
      this.updateConversationAfterDeleteMessages(message.cid, message.ids);
    };

    api.onUserTypingListener = (data) => {
      const { cid, from } = data;

      const conversation = store.getState().conversations.entities[cid];
      if (!conversation) return;
      const newTypingUsersArray = [...(conversation.typing_users || [])];
      !newTypingUsersArray.includes(from) && newTypingUsersArray.push(from);
      store.dispatch(
        upsertChat({
          _id: cid,
          typing_users: newTypingUsersArray,
        }),
      );

      const { clearTypingStatus, lastRequestTime } = this.typingTimers[cid] || {};

      const typingDuration = TYPING_DURATION_MS;
      const now = Date.now();
      if (clearTypingStatus && now - lastRequestTime > typingDuration - 1000) {
        clearTimeout(clearTypingStatus);
      }

      this.typingTimers[cid] = {
        clearTypingStatus: setTimeout(() => {
          const conversation = store.getState().conversations.entities[cid];
          store.dispatch(
            upsertChat({
              _id: cid,
              typing_users: conversation.typing_users?.filter((id) => id !== from),
            }),
          );
        }, +typingDuration),
        lastRequestTime: now,
      };
    };

    store.subscribe(() => {
      let previousValue = this.currentChatId;
      this.currentChatId = store.getState().selectedConversation.value.id;

      if (this.currentChatId && (!previousValue || previousValue !== this.currentChatId)) {
        this.syncData();
      }
    });
  }

  async getMessagesByCid(cid, options) {
    if (!cid) return;

    const params = {
      cid,
      limit: +import.meta.env.VITE_MESSAGES_COUNT_TO_PRELOAD,
    };
    options.updated_at && (params.updated_at = options.updated_at);
    options.limit && (params.limit = options.limit);

    const messages = await api.messageList(params);

    // if (options.updated_at?.gt) return messages.reverse();

    return messages;
  }

  async syncData() {
    const cid = this.currentChatId;

    try {
      const messages = await this.getMessagesByCid(cid, {});

      const { conversation } = await this.processMessages(messages);

      if (conversation?.type !== "u") {
        api
          .getParticipantsByCids({
            cids: [cid],
          })
          .then(({ users }) => {
            store.dispatch(
              upsertParticipants({
                cid,
                participants: users.map((obj) => obj._id),
              }),
            );
            console.log(users);

            store.dispatch(upsertUsers(users));
          });
      }
    } catch (err) {
      store.dispatch(removeChat(cid));
      store.dispatch(setSelectedConversation({}));
      navigateTo("/");
    }
  }

  async sendMessage(message) {
    const { server_mid, t, modified, bot_message } = await api.messageCreate(message);

    const { mid, body, cid, from, attachments, replied_message_id, forwarded_message_id } = message;
    const mObject = {
      _id: server_mid,
      old_id: mid,
      body: modified?.body || body,
      attachments: modified?.attachments || attachments,
      from,
      status: "sent",
      replied_message_id,
      forwarded_message_id,
      t,
    };

    store.dispatch(addMessage(mObject));
    store.dispatch(updateLastMessageField({ cid, resaveLastMessageId: mid, msg: mObject }));
    store.dispatch(removeMessage(mid));

    if (bot_message) {
      const participants = store.getState().participants;
      if (!participants[bot_message.from]) {
        const botObject = await api.getUsersByIds({ ids: [bot_message.from] });
        store.dispatch(addUser(botObject[0]));
      }
      store.dispatch(addMessage(bot_message));
      store.dispatch(updateLastMessageField({ cid, msg: bot_message }));
    }

    return mObject;
  }

  async sendMessageEdit(mid, newFields) {
    await api.messageEdit({ mid, body: newFields.body });
    store.dispatch(
      upsertMessage({
        _id: mid,
        body: newFields.body,
        updated_at: new Date().toISOString(),
      }),
    );
  }

  async sendMessageDelete(cid, mids, type) {
    await api.messageDelete({ cid, mids, type });
    store.dispatch(removeMessages(mids));
    this.updateConversationAfterDeleteMessages(cid, mids);
  }

  async processMessages(newMessages) {
    if (!newMessages.length) return {};

    const convId = newMessages[0].cid;
    const conversation = store.getState().conversations.entities?.[convId];
    const oldMessagesIds = conversation?.messagesIds || [];
    const incomingIds = newMessages.map((el) => el._id);

    store.dispatch(addMessages(newMessages));

    const entities = store.getState().messages.entities || {};
    const updatedMessagesIds = mergeChronologicalMessageIds(oldMessagesIds, incomingIds, entities);

    store.dispatch(
      upsertChat({
        _id: convId,
        messagesIds: updatedMessagesIds,
        activated: true,
      }),
    );

    const mAttachments = {};
    const repliedMids = [];

    const handleAttachments = (mid, attachments) => {
      attachments.forEach((obj) => {
        const mAttachmentsObject = mAttachments[obj.file_id];
        if (!mAttachmentsObject) {
          mAttachments[obj.file_id] = { _id: mid, ...obj };
          return;
        }

        const mids = mAttachmentsObject._id;
        mAttachments[obj.file_id]._id = Array.isArray(mids) ? [mid, ...mids] : [mid, mids];
      });
    };

    for (let i = 0; i < newMessages.length; i++) {
      const { _id, attachments, replied_message_id } = newMessages[i];
      attachments && handleAttachments(_id, attachments);
      replied_message_id && repliedMids.push(replied_message_id);
    }

    if (repliedMids.length) {
      const repliedMsgs = await api.messageList({
        cid: convId,
        ids: repliedMids,
      });
      const receivedIds = new Set(
        repliedMsgs.map((msg) => {
          msg.attachments && handleAttachments(msg._id, msg.attachments);
          return msg._id;
        }),
      );
      repliedMsgs.length && store.dispatch(addMessages(repliedMsgs));

      const notReceived = repliedMids.filter((mid) => !receivedIds.has(mid));
      notReceived.length && store.dispatch(addMessages(notReceived.map((_id) => ({ _id, error: "Message deleted" }))));
    }

    if (Object.keys(mAttachments).length > 0) {
      DownloadManager.getDownloadFileLinks(mAttachments).then((msgs) => {
        const messagesToUpdate = msgs.flatMap((msg) => {
          const mids = Array.isArray(msg._id) ? msg._id : [msg._id];
          return mids.map((mid) => ({ ...msg, _id: mid }));
        });

        store.dispatch(upsertMessages(messagesToUpdate));
      });
    }

    return { messagesIds: updatedMessagesIds, conversation };
  }

  buildForwardedSnapshots(mids) {
    const messages = store.getState().messages?.entities || {};
    return mids.map((mid) => {
      const m = messages[mid];
      if (!m) return { _id: mid, body: "", attachments: [] };
      return {
        _id: m._id,
        body: m.body ?? "",
        attachments: Array.isArray(m.attachments) ? m.attachments.map((a) => ({ ...a })) : [],
        from: m.from,
        t: m.t,
        forwarded_message_id: m.forwarded_message_id,
      };
    });
  }
}

const messagesService = new MessagesService();

export default messagesService;
