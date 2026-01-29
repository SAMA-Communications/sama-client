import { Conversation } from "../../../types/samaWssModels";

export interface ConversationItemListProps {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  additionalOnClickfunc: Function;
}
