import type { Conversation, User } from "types/samaWssModels";

export interface DraftPatch {
  text?: string;
  replied_mid?: string;
  edited_mid?: string;
  updated_mid?: string;
  forwarded_mid?: string | string[];
  forwarded_mids?: string[];
  forwarded_snapshots?: Record<string, unknown>[];
}

export interface useDraftsProps {
  syncDraftByCid: (cid: string, oldDraft: object, convUpdatedAt: string) => void;
  saveDraft: (cid: string, options: DraftPatch) => void;
  flushDraftToLocalStorage: (cid: string) => void;
  saveLastInputText: (cid: string, text: string) => void;

  getDraft: (cid: string) => Record<string, unknown>;
  getDraftField: (cid: string, field: string) => unknown;
  getDraftMessage: (cid: string) => string;
  getDraftRepliedMessageId: (cid: string) => string | undefined;
  getDraftEditedMessageId: (cid: string) => string | undefined;
  getLastInputText: (cid: string) => string;
  getExternalProps: () => Record<string, { draft_replied_mid?: boolean; draft_edited_mid?: boolean }>;

  removeDraft: (cid: string) => void;
  removeDraftWithOptions: (cid: string, fields: string | string[], opts?: { syncReduxNow?: boolean }) => void;
  purgeDraft: (cid: string) => void;
  pushLocalDraftToReduxNow: (cid: string) => void;
  savePreEditComposeText: (cid: string, text: string) => void;
  consumePreEditComposeText: (cid: string) => string;
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
  /** Next page; pagination cursor is maintained by the host app (e.g. Redux), not from the sorted UI list. */
  fetchConversations: () => Promise<Conversation[]>;

  updateChatImage: (file: File) => void;
  updateNameAndDescription: (data: { name?: string; description?: string }) => boolean;

  sendTypingStatus: (cid: string) => void;

  deleteAndLeave: () => void;
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

export interface SearchBlockDataOptions {
  isSearchOnlyUsers?: boolean;
  isShowDefaultConvs?: boolean;
}

export interface SearchBlockDataResult {
  searchedUsers: User[];
  searchedChats: Conversation[];
  defaultChats: Conversation[];
  isUserSearched: string | null;
  isChatSearched: string | null;
  isPending: boolean;
}

export interface SamaAdapters {
  useDrafts(): useDraftsProps;
  useParticipants(): useParticipantsProps;
  useConversations(): useConversationsProps;
  useMessages(): useMessagesProps;
  useContextMenu(): useContextMenuProps;

  userUtils: userUtilsProps;
  conversationUtils: conversationUtilsProps;
  mediaUtils: mediaUtilsProps;
  formatedUtils: formatedUtilsProps;

  /** Optional. When set, SearchBlock can call it to get current search data (client updates a ref from useSearchBlock) so the client can pass only searchText + options. */
  getSearchBlockData?: () => SearchBlockDataResult;
}
