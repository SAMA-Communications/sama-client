import type { Message } from "types/samaWssModels";

export interface LastMessageProps {
  message?: Message;
  draft?: {
    text?: string;
    replied_mid?: string;
  };
  isSelected: boolean;
  countOfUnreadMessages: number;
  isShowUserName?: boolean;
}
