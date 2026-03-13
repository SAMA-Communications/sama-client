import type { Conversation, User } from "types/samaWssModels";

import { SamaAdapters } from "@adapters/types";

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
  const saveDraft = (cid: string, options: { text?: string; replied_mid?: string; edited_mid?: string }) => {};
  const saveLastInputText = (cid: string, text: string) => {};

  const removeDraft = (cid: string) => {};
  const removeDraftWithOptions = (cid: string, fields: string | string[]) => {};

  const getDraft = (cid: string) => ({ text: "", replied_mid: "", edited_mid: "", updated_at: 0 });
  const getDraftMessage = (cid: string) => "";
  const getLastInputText = (cid: string) => "";
  const getExternalProps = () => ({});

  return {
    syncDraftByCid,
    saveDraft,
    saveLastInputText,

    removeDraft,
    removeDraftWithOptions,

    getDraft,
    getDraftMessage,
    getLastInputText,
    getExternalProps,
  };
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
  const setSelectedConversation = (cid: string) => {};
  const storeNewConversations = (conversations: Conversation[]) => {};

  const getConversationById = (cid: string) => defaultconversation;
  const getSelectedConversation = () => defaultconversation;
  const fetchConversations = async (): Promise<Conversation[]> => {
    return Promise.resolve([defaultconversation]);
  };

  const updateChatImage = (file: File) => {};
  const updateNameAndDescription = (data: { name?: string; description?: string }) => true;

  const sendTypingStatus = (cid: string) => {};

  const deleteAndLeave = () => {};

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
};

function useMessages() {
  const deleteSelectedMessages = async (selectedCID: string, mids: string[]) => {};
  const getSelectedMessages = () => ({ countOfSelectedMessages: 0, midsArrayOfSelectedMessages: [""] });

  const summarizeMessages = async (selectedCID: string, filter: string) => {};
  const changeMessageTone = async (body: string, tone: string) => "";

  const editMessage = async (
    inputValue: string,
    selectedConversation: Conversation,
    editedMessage: { _id: string; body: string },
  ) => "";
  const createAndSendMessage = async (
    inputValue: string,
    selectedConversation: Conversation,
    draftExtenralProps: Record<string, { draft_replied_mid?: boolean }>,
    isSendMessageDisable: boolean,
    disableInput: Function,
    enableInput: Function,
    onSend: Function,
  ) => "";

  return {
    deleteSelectedMessages,
    getSelectedMessages,

    summarizeMessages,
    changeMessageTone,

    editMessage,
    createAndSendMessage,
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
    extractFilesFromClipboard: (clipboardItems) => [],
  },
  formatedUtils: {
    getFormatedTime: (dateParams) => "string",
    calcInputHeight: (text) => 0,
  },
};
