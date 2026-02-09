import { Conversation, User } from "types/samaWssModels";

export interface useDraftsProps {
  syncDraftByCid: (cid: string, oldDraft: object, convUpdatedAt: string) => void;
  saveDraft: (cid: string, options: { text?: string; replied_mid?: string; edited_mid?: string }) => any;
  saveLastInputText: (cid: string, text: string) => void;

  getDraft: (cid: string) => { text: string; replied_mid: string; edited_mid: string; updated_at: number };
  getDraftMessage: (cid: string) => string;
  getLastInputText: (cid: string) => string;
  getExternalProps: () => Record<string, { draft_replied_mid?: boolean }>;

  removeDraft: (cid: string) => void;
  removeDraftWithOptions: (cid: string, fields: string | string[]) => void;
}

export interface useParticipantsProps {
  getParticipantsByIdsAsObject: (uids: string[]) => Record<string, User>;
  getParticipantsByIdsAsList: (uids: string[]) => User[];
  getCurrentUser: () => User;
  getUserById: (uid: string) => User;
  getOpponentByCid: (cid: string, currentUserId: string) => User | null;

  updateCurrentUserAvatar: (file: File) => void;
  updateCurrentUserPassword: (currentPassword: string, newPassword: string) => void;
  updateCurrentUserFields: (data: {
    email?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
  }) => boolean;

  deleteCurrentUser: () => boolean;
}

export interface useConversationsProps {
  setSelectedConversation: (cid: string) => void;
  storeNewConversations: (conversations: Conversation[]) => void;

  getConversationById: (cid: string) => Conversation;
  getSelectedConversation: () => Conversation;
  fetchConversations: ({ updated_at: { lt } }: { updated_at: { lt: string } }) => Promise<Conversation[]>;

  updateChatImage: (file: File) => void;
  updateNameAndDescription: (data: { name?: string; description?: string }) => boolean;

  sendTypingStatus: (cid: string) => void;
}

export interface useHistoryProps {
  openProfileById: (uid: string) => void;
  openCurrentUserProfile: () => void;
  openContextMenuWithParams: (params: any) => void;
  openAddParticipantsWindow: () => void;
  openEditUserProfileWindow: () => void;
  openEditConversationWindow: () => void;
  openForwardSection: () => void;
  openChatOrPaticipantInfo: (conversation?: Conversation, participant?: User | null) => void;
  openAttachmentHub: () => void;

  undoLastSection: () => void;

  closeChatInfoPage: () => void;
  closeCurrentUserProfile: () => void;
  closeSelectionMode: () => void;

  isLocationIncludeAttach: () => boolean;

  navigateToAuthPage: () => void;
}

export interface useMessagesProps {
  deleteSelectedMessages: (selectedCID: string, mids: string[]) => void;
  getSelectedMessages: () => { countOfSelectedMessages: number; midsArrayOfSelectedMessages: string[] };

  summarizeMessages: (selectedCID: string, filter: string) => void;
  changeMessageTone: (body: string, tone: string) => Promise<string>;

  editMessage: (
    inputValue: string,
    selectedConversation: Conversation,
    editedMessage: { _id: string; body: string },
  ) => Promise<string | null>;
  createAndSendMessage: (
    inputValue: string,
    selectedConversation: Conversation,
    draftExtenralProps: Record<string, { draft_replied_mid?: boolean }>,
    isSendMessageDisable: boolean,
    disableInput: Function,
    enableInput: Function,
    onSend: Function,
  ) => Promise<string | null>;
}

export interface useContextMenuProps {
  openContextMenu: (category: string, list: string[], coords: { x: number; y: number }) => void;
}

export interface userUtilsProps {
  getLastMessageUserName: (user: User) => string;
  getUserFullName: (user: User) => string;
  getUserInitials: (user: User) => string;
  getLastVisitTime: (timestamp: number, userLocale?: string) => string;
}

export interface conversationUtilsProps {
  getLastUpdateTime: (convUpdatedAt: string, lastMessageTime: number) => string;
}

export interface mediaUtilsProps {
  getFileType: (fileName?: string, fileContentType?: string) => string;
  extractFilesFromClipboard: (clipboardItems: any) => File[];
}

export interface formatedUtilsProps {
  getFormatedTime: (dateParams: string) => string;
  calcInputHeight: (text: string) => number;
}

export interface SamaAdapters {
  useDrafts(): useDraftsProps;
  useParticipants(): useParticipantsProps;
  useConversations(): useConversationsProps;
  useHistory(): useHistoryProps;
  useMessages(): useMessagesProps;
  useContextMenu(): useContextMenuProps;

  userUtils: userUtilsProps;
  conversationUtils: conversationUtilsProps;
  mediaUtils: mediaUtilsProps;
  formatedUtils: formatedUtilsProps;
}
