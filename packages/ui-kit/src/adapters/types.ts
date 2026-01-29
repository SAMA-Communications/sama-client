import { Conversation, User } from "types/samaWssModels";

export interface useDraftsProps {
  syncDraftByCid: (cid: string, oldDraft: object, convUpdatedAt: string) => void;
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
  getConversationById: (cid: string) => Conversation;
  getSelectedConversation: () => Conversation;

  setSelectedConversation: (cid: string) => void;

  fetchConversations: ({ updated_at: { lt } }: { updated_at: { lt: string } }) => Promise<Conversation[]>;

  storeNewConversations: (conversations: Conversation[]) => void;

  updateChatImage: (file: File) => void;
  updateNameAndDescription: (data: { name?: string; description?: string }) => boolean;
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

  undoLastSection: () => void;

  closeChatInfoPage: () => void;
  closeCurrentUserProfile: () => void;
  closeSelectionMode: () => void;

  navigateToAuthPage: () => void;
}

export interface useMessagesProps {
  deleteSelectedMessages: (selectedCID: string, mids: string[]) => void;
  getSelectedMessages: () => { countOfSelectedMessages: number; midsArrayOfSelectedMessages: string[] };
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
}
