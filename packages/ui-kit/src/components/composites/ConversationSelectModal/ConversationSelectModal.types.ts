import { ReactNode } from "react";

export interface ConversationSelectModalProps {
  title: string;
  onClose: () => void;
  /** Rendered above the scroll area (e.g. SearchInput), fixed at top */
  topContent?: ReactNode;
  /** Scrollable content (e.g. SearchBlock) */
  children: ReactNode;
}

