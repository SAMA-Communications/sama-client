import { Message } from "types/samaWssModels";

export interface LastMessageProps {
  message?: Message;
  draft?: {
    text?: string;
    replied_mid?: string;
  };
  countOfUnreadMessages: number;
  isShowUserName?: boolean;
}
