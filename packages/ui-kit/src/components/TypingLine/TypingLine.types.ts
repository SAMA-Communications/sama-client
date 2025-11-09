import { Participant } from "./Participants.types";

export interface TypingLineProps {
  userIds?: string[];
  displayUserNames?: boolean;
  displayBackground?: boolean;
  textColor?: string;
  className?: string;
}

export interface TypingLineInternalProps extends TypingLineProps {
  participants?: Record<string, Participant>;
  getUserName?: (user: Participant) => string;
}
