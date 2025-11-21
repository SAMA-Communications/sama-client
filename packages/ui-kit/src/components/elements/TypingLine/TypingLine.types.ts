import { User } from "types/samaWssModels";

export interface TypingLineProps {
  typingUserIds?: string[];
  isDisplayUserNames?: boolean;
  isDisplayBackground?: boolean;
}

export interface TypingLineInternalProps extends TypingLineProps {
  participants?: Record<string, User>;
  getUserName?: (user: User) => string;
}
