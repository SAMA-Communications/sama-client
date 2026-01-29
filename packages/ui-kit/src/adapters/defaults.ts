import { Conversation, User } from "types/samaWssModels";

import { SamaAdapters } from "./types";

const defaultuser = {
  _id: "default_id",
  organization_id: "default_org_id",
  login: "default_login",
  updated_at: "default_updated_at",
  created_at: "default_created_at",
  recent_activity: 0,
};

const defaultconversation = {
  _id: "default_id",
  organization_id: "default_org_id",
  type: "g" as "g" | "u",
  owner_id: "default_owner_id",
  participants: [],
  messages: [],
  updated_at: "default_updated_at",
  created_at: "default_created_at",
  draft: null,
  last_message: null,
  unread_messages_count: 0,
};

const useDrafts = () => {
  const syncDraftByCid = (cid: string, oldDraft: object, convUpdatedAt: string) => ({});
  return { syncDraftByCid };
};

const useParticipants = () => {
  const getParticipantsByIdsAsObject = (uids: string[]) => ({});
  const getParticipantsByIdsAsList = (uids: string[]) => [];
  const getCurrentUser = () => defaultuser;
  const getUserById = (uid: string) => defaultuser;
  const getOpponentByCid = (cid: string, currentUserId: string) => defaultuser || null;

  const updateCurrentUserAvatar = (file: File) => {};
  const updateCurrentUserPassword = (currentPassword: string, newPassword: string) => {};
  const updateCurrentUserFields = (data: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  }) => {
    return true;
  };

  const deleteCurrentUser = () => true;

  return {
    getParticipantsByIdsAsObject,
    getParticipantsByIdsAsList,
    getCurrentUser,
    getUserById,
    getOpponentByCid,

    updateCurrentUserAvatar,
    updateCurrentUserPassword,
    updateCurrentUserFields,

    deleteCurrentUser,
  };
};

const useConversations = () => {
  const getConversationById = (cid: string) => defaultconversation;
  const getSelectedConversation = () => defaultconversation;
  const setSelectedConversation = (cid: string) => {};
  const fetchConversations = async (): Promise<Conversation[]> => {
    return Promise.resolve([defaultconversation]);
  };
  const storeNewConversations = (conversations: Conversation[]) => {};
  const updateChatImage = (file: File) => {};
  const updateNameAndDescription = (data: { name?: string; description?: string }) => true;

  return {
    getConversationById,
    getSelectedConversation,
    setSelectedConversation,
    fetchConversations,
    storeNewConversations,
    updateChatImage,
    updateNameAndDescription,
  };
};

function useHistory() {
  const openProfileById = (uid: string) => {};
  const openCurrentUserProfile = () => {};
  const openContextMenuWithParams = (params: any) => {};
  const openAddParticipantsWindow = () => {};
  const openEditUserProfileWindow = () => {};
  const openEditConversationWindow = () => {};
  const openForwardSection = () => {};
  const openChatOrPaticipantInfo = (conversation?: Conversation, participant?: User | null | undefined) => {};

  const undoLastSection = () => {};

  const closeChatInfoPage = () => {};
  const closeCurrentUserProfile = () => {};
  const closeSelectionMode = () => {};

  const navigateToAuthPage = () => {};

  return {
    openProfileById,
    openContextMenuWithParams,
    openCurrentUserProfile,
    openAddParticipantsWindow,
    openEditUserProfileWindow,
    openEditConversationWindow,
    openForwardSection,
    openChatOrPaticipantInfo,

    undoLastSection,

    closeChatInfoPage,
    closeCurrentUserProfile,
    closeSelectionMode,

    navigateToAuthPage,
  };
}

function useMessages() {
  const deleteSelectedMessages = async (selectedCID: string, mids: string[]) => {};
  const getSelectedMessages = () => ({ countOfSelectedMessages: 0, midsArrayOfSelectedMessages: [""] });

  return {
    deleteSelectedMessages,
    getSelectedMessages,
  };
}

function useContextMenu() {
  const openContextMenu = (category: string, list: string[], coords: { x: number; y: number }) => {};

  return {
    openContextMenu,
  };
}

export const defaultAdapters: SamaAdapters = {
  useDrafts,
  useParticipants,
  useConversations,
  useHistory,
  useMessages,
  useContextMenu,

  userUtils: {
    getLastMessageUserName: (user) => "",
    getUserFullName: (user) => "",
    getUserInitials: (user) => "",
    getLastVisitTime: (timestamp, userLocale) => "",
  },
  conversationUtils: {
    getLastUpdateTime: (convUpdatedAt, lastMessageTime) => "",
  },
  mediaUtils: {
    getFileType: (fileName, fileContentType) => "",
  },
};
