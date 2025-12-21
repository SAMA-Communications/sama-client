import { Conversation, User } from "types/samaWssModels";

export interface useDraftsProps {
  syncDraftByCid: (
    cid: string,
    oldDraft: object,
    convUpdatedAt: string
  ) => void;
}

export interface useParticipantsProps {
  getParticipantsByIdsAsObject: (uids: string[]) => Record<string, User>;
  getParticipantsByIdsAsList: (uids: string[]) => User[];
  getCurrentUser: () => User;
  getUserById: (uid: string) => User;
}

export interface useConversationsProps {
  getConversationById: (cid: string) => Conversation;
  getSelectedConversation: () => Conversation;
  setSelectedConversation: (cid: string) => void;
  fetchConversations: ({
    updated_at: { lt },
  }: {
    updated_at: { lt: string };
  }) => Promise<Conversation[]>;
  storeNewConversations: (conversations: Conversation[]) => void;
}

export interface userUtilsProps {
  getLastMessageUserName: (user: User) => string;
  getUserFullName: (user: User) => string;
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

  userUtils: userUtilsProps;
  conversationUtils: conversationUtilsProps;
  mediaUtils: mediaUtilsProps;
}
