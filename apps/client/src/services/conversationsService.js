import api from "@api/api";

import DownloadManager from "@lib/downloadManager";
import { hydrateDraftsFromLocalStorage, purgeDraft } from "@lib/draftsEngine.js";
import eventEmitter from "@lib/eventEmitter";

import { notificationQueueByCid } from "@services/tools/notifications";

import { CONVERSATION_LIST_IDS_CHUNK } from "@src/utils/constants.js";

import store from "@store/store";
import {
  insertChat,
  insertChats,
  removeChat,
  upsertChat,
  upsertChats,
  upsertParticipants,
} from "@store/values/Conversations";
import { addUsers, upsertUsers } from "@store/values/Participants";
import { clearSelectedConversation, setSelectedConversation } from "@store/values/SelectedConversation";

import { getOpponentId } from "@utils/ConversationUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { history } from "@utils/history.js";
import { processFile, isHeic } from "@utils/MediaUtils.js";
import { navigateTo } from "@utils/NavigationUtils.js";
import { validateFieldLength } from "@utils/ValidationGeneral.js";

const ensureConversationPromises = new Map();

class ConversationsService {
  userIsLoggedIn = false;

  constructor() {
    api.onConversationCreateListener = this.handleConversationCreate;
    api.onConversationUpdateListener = this.handleConversationUpdate;
    api.onConversationDeleteListener = this.handleConversationDelete;

    store.subscribe(this.handleStoreUpdate);
  }

  handleStoreUpdate = () => {
    const currentUserIsLoggedIn = store.getState().userIsLoggedIn.value;
    if (currentUserIsLoggedIn && !this.userIsLoggedIn) {
      this.userIsLoggedIn = true;
      this.syncData();
    } else if (!currentUserIsLoggedIn && this.userIsLoggedIn) {
      this.userIsLoggedIn = false;
    }
  };

  handleConversationCreate = async (chat) => {
    try {
      const conversation = store.getState().conversations.entities?.[chat._id];
      if (conversation?._id) {
        store.dispatch(upsertChat({ ...chat }));
        notificationQueueByCid[chat._id]?.forEach((pushMessage) => eventEmitter.emit("onMessage", pushMessage));
        return;
      }

      const { users } = await api.getParticipantsByCids({ cids: [chat._id] });
      store.dispatch(
        upsertChat({
          ...chat,
          unread_messages_count: chat.unread_messages_count || 0,
          messagesIds: null,
          participants: users.map((u) => u.native_id),
        }),
      );
      store.dispatch(addUsers(users));

      notificationQueueByCid[chat._id]?.forEach((pushMessage) => eventEmitter.emit("onMessage", pushMessage));
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  handleConversationUpdate = async (chat) => {
    try {
      store.dispatch(
        upsertChat({
          ...chat,
        }),
      );
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  handleConversationDelete = (chat) => {
    store.dispatch(removeChat(chat._id));
    if (history.location.hash.includes(chat._id.toString())) {
      store.dispatch(setSelectedConversation({}));
      showCustomAlert(`You were removed from the ${chat.name} conversation`, "warning");
      navigateTo("/");
    }
  };

  async syncData() {
    try {
      const chats = await api.conversationList({});
      store.dispatch(insertChats(chats.map((obj) => ({ ...obj, participants: [] }))));
      hydrateDraftsFromLocalStorage();
      if (chats.length > 0) await this.getAndStoreParticipantsFromChats(chats);
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  }

  async getAndStoreParticipantsFromChats(conversations) {
    const { users, conversations: convs } = await api.getParticipantsByCids({
      cids: conversations.map((el) => el._id),
    });
    store.dispatch(upsertUsers(users));

    const participantsArray = Object.entries(convs).map(([cid, participants]) => ({ _id: cid, participants }));
    store.dispatch(upsertChats(participantsArray));

    const additionalUsersIds = [];
    conversations.forEach((chat) => {
      if (chat.last_message?.from) {
        !users.find((u) => u.native_id === chat.last_message?.from) && additionalUsersIds.push(chat.last_message?.from);
      }
      if (chat.type === "g") return;
      const opponentId = getOpponentId(chat, api.curerntUserId);
      !users.find((u) => u.native_id === opponentId) && additionalUsersIds.push(opponentId);
    });
    if (additionalUsersIds.length) {
      const additionalUsers = await api.getUsersByIds({
        ids: additionalUsersIds,
      });
      store.dispatch(upsertUsers(additionalUsers));
    }
  }

  async createPrivateChat(userId, userObject) {
    if (!userId) {
      return;
    }

    const requestData = {
      type: "u",
      participants: [userId],
    };

    const chat = await api.conversationCreate(requestData);
    userObject && store.dispatch(addUsers([userObject]));
    const existingChat = store.getState().conversations.entities[chat._id];
    store.dispatch(
      upsertChat(existingChat && existingChat.messagesIds?.length ? { ...chat } : { ...chat, messagesIds: null }),
    );
    store.dispatch(setSelectedConversation({ id: chat._id }));

    return chat._id;
  }

  async createGroupChat(participants, name, imageFile) {
    if (!participants.length || !name) {
      showCustomAlert("Choose participants.", "warning");
      return;
    }

    let imageFileProcessed, image_object;
    if (imageFile) {
      imageFileProcessed = await processFile(imageFile, 0.2, 1024);
      const imageObject = (await DownloadManager.getFileObjects([imageFileProcessed])).at(0);
      image_object = {
        file_id: imageObject.file_id,
        file_name: imageObject.file_name,
        file_blur_hash: imageFileProcessed.blurHash,
      };
    }

    const chat = await api.conversationCreate({
      type: "g",
      name,
      image_object,
      participants: participants.map((el) => el._id),
    });

    store.dispatch(addUsers(participants));
    store.dispatch(
      insertChat({
        ...chat,
        messagesIds: null,
        participants: [api.curerntUserId, ...participants.map((el) => el._id)],
      }),
    );
    store.dispatch(setSelectedConversation({ id: chat._id }));

    return chat._id;
  }

  async sendEditNameAndDescriptionRequest(data) {
    const keys = Object.keys(data);
    if (!keys.length) {
      return;
    }

    for (const key of keys) {
      if (validateFieldLength(data[key], 0, 255, "fields")) {
        return false;
      }
    }

    const selectedConversation = store.getState().selectedConversation.value;

    try {
      return await api.conversationUpdate({
        cid: selectedConversation.id,
        ...data,
      });
    } catch (error) {
      showCustomAlert(error.message, "danger");
      return false;
    }
  }

  async addParticipants(participants) {
    const selectedConversation = store.getState().selectedConversation.value;

    if (!participants.length) {
      return;
    }

    const addUsersArr = participants.map((el) => el._id);
    const requestData = {
      cid: selectedConversation.id,
      participants: { add: addUsersArr },
    };

    return await api.conversationUpdate(requestData);
  }

  async removeParticipant(userId) {
    const { selectedConversation, conversations } = store.getState();
    const selectedCID = selectedConversation.value.id;

    await api.conversationUpdate({
      cid: selectedCID,
      participants: { remove: [userId] },
    });

    store.dispatch(
      upsertParticipants({
        cid: selectedCID,
        participants: conversations.entities[selectedCID].participants.filter((uId) => uId !== userId),
      }),
    );
  }

  async updateChatImage(file) {
    if (!file) {
      return;
    }

    const selectedConversationId = store.getState().selectedConversation.value.id;
    store.dispatch(
      upsertChat({
        _id: selectedConversationId,
        image_url: isHeic(file.name) ? null : URL.createObjectURL(file),
      }),
    );

    const imageFile = await processFile(file, 0.2, 300);
    if (!imageFile) {
      store.dispatch(upsertChat({ _id: selectedConversationId, image_url: undefined }));
      showCustomAlert("An error occured while processing the file.", "warning");
      return;
    }

    const imageObject = (await DownloadManager.getFileObjects([imageFile])).at(0);
    const requestData = {
      cid: selectedConversationId,
      image_object: {
        file_id: imageObject.file_id,
        file_name: imageObject.file_name,
        file_blur_hash: imageFile.blurHash,
      },
    };

    try {
      const conversationObject = await api.conversationUpdate(requestData);
      conversationObject["image_url"] = imageObject.file_url;
      store.dispatch(upsertChat(conversationObject));
    } catch (err) {
      showCustomAlert("The server connection is unavailable.", "warning");
      return;
    }
  }

  async deleteConversation() {
    try {
      const selectedConversation = store.getState().selectedConversation.value;
      await api.conversationDelete({ cid: selectedConversation.id });
      store.dispatch(clearSelectedConversation());
      store.dispatch(removeChat(selectedConversation.id));
      purgeDraft(selectedConversation.id);
    } catch (err) {
      showCustomAlert(err.message, "warning");
    }
  }

  async search(data) {
    return await api.conversationSearch(data);
  }

  async fetchConversationsByIds(ids) {
    const conversations = store.getState().conversations.entities || {};
    const missingConvIds = ids.filter((id) => !conversations[id]);
    const chunkSize = CONVERSATION_LIST_IDS_CHUNK;

    for (let i = 0; i < missingConvIds.length; i += chunkSize) {
      const chunkConvIds = missingConvIds.slice(i, i + chunkSize);
      try {
        const chats = await api.conversationList({ ids: chunkConvIds });
        if (!chats?.length) continue;

        store.dispatch(upsertChats(chats.map((obj) => ({ ...obj, participants: [] }))));
        await this.getAndStoreParticipantsFromChats(chats);
      } catch (err) {
        showCustomAlert(err.message, "danger");
      }
    }
  }

  async ensureConversationInStoreIfMissing(cid) {
    if (!cid) return true;

    const conversations = store.getState().conversations.entities || {};
    if (conversations[cid]?._id) return true;

    const existing = ensureConversationPromises.get(cid);
    if (existing) return existing;

    const promise = (async () => {
      try {
        const chats = await api.conversationList({ ids: [cid] });
        if (!chats?.length) {
          this.redirectFromUnavailableConversation(cid);
          return false;
        }

        store.dispatch(upsertChats(chats.map((obj) => ({ ...obj, participants: [] }))));
        await this.getAndStoreParticipantsFromChats(chats);

        const stillMissing = !store.getState().conversations.entities?.[cid]?._id;
        if (stillMissing) {
          this.redirectFromUnavailableConversation(cid);
          return false;
        }

        return true;
      } catch (err) {
        showCustomAlert(err.message, "danger");
        this.redirectFromUnavailableConversation(cid);
        return false;
      } finally {
        ensureConversationPromises.delete(cid);
      }
    })();

    ensureConversationPromises.set(cid, promise);
    return promise;
  }

  redirectFromUnavailableConversation(expectedCid) {
    const currentCid = history.location.hash?.slice(1)?.split("/")[0] || null;
    if (expectedCid && currentCid !== expectedCid) {
      return;
    }

    store.dispatch(clearSelectedConversation());
    const { pathname, search } = history.location;
    history.navigate(`${pathname}${search || ""}`);
  }

  async resolveConversationsByIds(convIds) {
    if (!convIds?.length) return [];

    await this.fetchConversationsByIds(convIds);
    const conversations = store.getState().conversations.entities || {};

    return convIds.map((id) => conversations[id]).filter(Boolean);
  }
}

const conversationService = new ConversationsService();

export default conversationService;
