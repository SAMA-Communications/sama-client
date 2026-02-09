import { Conversation } from "../../../types/samaWssModels";

export interface ConversationInfoProps {
  conversation: Conversation;
  isMobile: boolean;
  shareRef: React.Ref<HTMLDivElement>;
}
