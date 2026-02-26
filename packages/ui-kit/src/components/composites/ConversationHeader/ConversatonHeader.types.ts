import { MouseEventHandler } from "react";

import { Conversation } from "types/samaWssModels";

export interface ConversationHeaderProps {
  conversation: Conversation;
  isSelectionMode: boolean;
  currentTab: string;
  changeTabFunc: Function;
  closeFormFunc: MouseEventHandler<HTMLButtonElement>;
}
