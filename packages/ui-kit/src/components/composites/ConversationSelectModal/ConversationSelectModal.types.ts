import { ReactNode } from "react";

export interface ConversationSelectModalProps {
  title: string;
  onClose: () => void;
  /** Modal content (e.g. SearchInput + SearchBlock from client) */
  children: ReactNode;
}
