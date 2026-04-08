import { ReactNode } from "react";

export interface ConversationSelectModalProps {
  /** Header line next to the close control. */
  title: string;
  /** Backdrop (`Modal` onClick) and X button. */
  onClose: () => void;
  /** Rendered above the scroll area (e.g. SearchInput), fixed at top */
  topContent?: ReactNode;
  /** Scrollable content (e.g. SearchBlock) */
  children: ReactNode;
}

