import { MouseEventHandler } from "react";

export interface ConversationHeaderProps {
  closeFormFunc: MouseEventHandler<HTMLButtonElement>;
  currentTab: string;
  changeTabFunc: Function;
}
