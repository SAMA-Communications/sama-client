import type { User, Conversation } from "types/samaWssModels";

/** Flags passed with `searchText` for adapter `getSearchBlockData` resolution. */
export interface SearchBlockDataOptions {
  isSearchOnlyUsers?: boolean;
  isShowDefaultConvs?: boolean;
}

/** User + conversation search UI; data from props or `getAdapters().getSearchBlockData`. */
export interface SearchBlockProps {
  /** When `getSearchBlockData` exists on adapters, pass `searchText` + `searchOptions`; else pass lists below. */
  searchText?: string | null;
  searchOptions?: SearchBlockDataOptions;

  /** Users returned from search (required when not using adapter getSearchBlockData) */
  searchedUsers?: User[];
  /** Chats/conversations from search (when not searchOnlyUsers) */
  searchedChats?: Conversation[];
  /** Default conversations to show when not searching (e.g. recent) */
  defaultChats?: Conversation[];
  isShowDefaultConvs: boolean;
  isSearchOnlyUsers: boolean;
  /** Message when no users found */
  isUserSearched?: string | null;
  /** Message when no chats found */
  isChatSearched?: string | null;
  /** Only used when adapter provides getSearchBlockData */
  isPending?: boolean;

  selectedUsers: User[];
  onAddUser?: (user: User) => void;
  onRemoveUser?: (user: User) => void;
  /** Alias for onAddUser (when using Select modal) */
  addUserToArray?: (user: User) => void;
  /** Alias for onRemoveUser (when using Select modal) */
  removeUserFromArray?: (user: User) => void;
  isClickDisabledFunc?: (user: User) => boolean;
  isMaxLimit: boolean;
  onClearInputText?: () => void;
  isClearInputText?: boolean;
  /** When user clicks a conversation in the list */
  onConversationClick?: (cid: string) => void;
  /** When user clicks a user row (only when isSelectUserToArray is false) */
  onUserClick?: (user: User) => void;
  /** True = row click toggles selection via onAddUser/onRemoveUser; false = row click calls onUserClick */
  isSelectUserToArray: boolean;
  /** For conversation list selection highlight */
  selectedConversationId?: string | null;
  customClassName?: string;
}
