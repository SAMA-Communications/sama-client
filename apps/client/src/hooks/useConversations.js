import api from "@api/api.js";

import conversationService from "@services/conversationsService.js";

import store from "@store/store.js";
import { insertChats } from "@store/values/Conversations.js";
import { setSelectedConversation as setSConversation } from "@store/values/SelectedConversation.js";

import { navigateTo } from "@utils/NavigationUtils.js";

export default function useConversations() {
  const getConversationById = (cid) => {
    return store.getState()?.conversations.entities[cid];
  };

  const getSelectedConversation = () => {
    const selectedConversationId =
      store.getState()?.selectedConversation.value.id;

    return getConversationById(selectedConversationId);
  };

  const setSelectedConversation = (cid) => {
    store.dispatch(setSConversation({ cid }));
    navigateTo(`/#${cid}`); //???
  };

  const fetchConversations = async ({ updated_at: { lt } }) => {
    return await api.conversationList({ updated_at: { lt } });
  };

  const storeNewConversations = (conversations) => {
    store.dispatch(
      insertChats(conversations.map((obj) => ({ ...obj, participants: [] })))
    );

    if (conversations.length > 0)
      conversationService.getAndStoreParticipantsFromChats(conversations);
  };

  return {
    getConversationById,
    getSelectedConversation,
    setSelectedConversation,
    fetchConversations,
    storeNewConversations,
  };
}
