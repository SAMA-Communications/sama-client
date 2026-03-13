import api from "@api/api.js";

import DownloadManager from "@lib/downloadManager.js";

import conversationService from "@services/conversationsService.js";

import store from "@store/store.js";
import { insertChats } from "@store/values/Conversations.js";
import { upsertChat } from "@store/values/Conversations.js";
import { setSelectedConversation as setSConversation } from "@store/values/SelectedConversation.js";

import { showCustomAlert } from "@utils/GeneralUtils.js";
import { isHeic, processFile } from "@utils/MediaUtils.js";
import { navigateTo } from "@utils/NavigationUtils.js";
import { validateFieldLength } from "@utils/ValidationGeneral.js";

export default function useConversations() {
  const getConversationById = (cid) => {
    return store.getState()?.conversations.entities[cid];
  };

  const getSelectedConversation = () => {
    const selectedConversationId = store.getState()?.selectedConversation.value.id;

    return getConversationById(selectedConversationId);
  };

  const setSelectedConversation = (cid) => {
    store.dispatch(setSConversation({ cid }));
    navigateTo(`/#${cid}`);
  };

  const fetchConversations = async ({ updated_at: { lt } }) => {
    return await api.conversationList({ updated_at: { lt } });
  };

  const storeNewConversations = (conversations) => {
    store.dispatch(insertChats(conversations.map((obj) => ({ ...obj, participants: [] }))));

    if (conversations.length > 0) conversationService.getAndStoreParticipantsFromChats(conversations);
  };

  const updateChatImage = async (file) => {
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
  };

  const updateNameAndDescription = async (data) => {
    const keys = Object.keys(data);
    if (!keys.length) {
      return false;
    }

    for (const key of keys) {
      if (validateFieldLength(data[key], 0, 255, "fields")) {
        return false;
      }
    }

    const selectedConversation = store.getState().selectedConversation.value;

    try {
      const updatedConversation = await api.conversationUpdate({
        cid: selectedConversation.id,
        ...data,
      });
      delete updatedConversation?.participants;
      store.dispatch(upsertChat(updatedConversation));
      return true;
    } catch (error) {
      showCustomAlert(error.message, "danger");
      return false;
    }
  };

  const sendTypingStatus = (cid) => {
    api.sendTypingStatus({ cid });
  };

  const deleteAndLeave = async () => {
    navigateTo("/");
    await conversationService.deleteConversation();
  };

  return {
    storeNewConversations,
    setSelectedConversation,

    getConversationById,
    getSelectedConversation,
    fetchConversations,

    updateChatImage,
    updateNameAndDescription,

    sendTypingStatus,

    deleteAndLeave,
  };
}
