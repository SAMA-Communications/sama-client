import { HTMLAttributes } from "react";
import { Conversation } from "types/samaWssModels";

export interface ConversationItemProps extends HTMLAttributes<HTMLDivElement> {
  conversation: Conversation;
  isSelected: boolean;
}
