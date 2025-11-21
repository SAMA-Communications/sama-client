import { Conversation } from "../../../types/samaWssModels";

export interface ConversationItemListProps {
  conversations: Conversation[];
  additionalOnClickfunc: Function;
}
