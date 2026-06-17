import type { Conversation } from "types/samaWssModels";

/** Search/pick conversation rows with optional title and empty state. */
export interface SearchConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string | null;
  /** Called when a conversation is selected. */
  onConversationClick: (cid: string) => void;
  showTitle?: boolean;
  /** Shown when the list is empty. */
  emptyMessage?: string | null;
}

