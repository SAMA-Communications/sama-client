import { User } from "../../../types/samaWssModels";

export interface ParticipantInChatProps {
  user: User;
  isOwner: boolean;
  isCurrentUserOwner: boolean;
}
