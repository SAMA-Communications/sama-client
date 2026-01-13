import { Conversation } from "../../../types/samaWssModels";

export interface ChatInfoProps {
  conversation: Conversation;
  isMobile: boolean;
  shareRef: React.Ref<HTMLDivElement>;
}
