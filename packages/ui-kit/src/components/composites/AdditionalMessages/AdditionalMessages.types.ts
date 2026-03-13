import type { ReactNode } from "react";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export type AdditionalMessagesType = "reply" | "edit" | "forward";

export interface AdditionalMessagesMessage {
  body?: string;
  attachments?: unknown[];
  from?: string;
  error?: string;
}

export interface AdditionalMessagesProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  type: AdditionalMessagesType;
  /** Single message (reply/edit) or first of forwarded list */
  message?: AdditionalMessagesMessage | null;
  /** For forward: array of forwarded messages (used for count) */
  messages?: unknown[];
  isPreview?: boolean;
  color?: "accent" | "white";
  onCloseFunc?: () => void;
  onClickFunc?: () => void;
  /** Sender display name (e.g. "Reply to John") */
  senderName?: string;
  /** Slot for first attachment thumbnail */
  attachmentSlot?: ReactNode;
}
