import type { User } from "types/samaWssModels";

import type { WrapperRootProps } from "../WrapperRoot";

export interface TypingLineProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  typingUserIds?: string[];
  isDisplayUserNames?: boolean;
  isDisplayBackground?: boolean;
}

export interface TypingLineInternalProps extends TypingLineProps {
  participants?: Record<string, User>;
  getUserName?: (user: User) => string;
}
