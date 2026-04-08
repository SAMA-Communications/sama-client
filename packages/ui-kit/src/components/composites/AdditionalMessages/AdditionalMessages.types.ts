import type { ReactNode } from "react";

import type { WrapperRootProps } from "@elements/WrapperRoot";

/** Strip mode: reply preview, edit banner, or forwarded bundle. */
export type AdditionalMessagesType = "reply" | "edit" | "forward";

/** Minimal message shape for titles/body; `error` causes the component to render nothing. */
export interface AdditionalMessagesMessage {
  body?: string;
  /** If length > 0 and `attachmentSlot` is set, a thumbnail row is shown. */
  attachments?: unknown[];
  /** Present on wire messages; not rendered in the current UI. */
  from?: string;
  /** When set, `AdditionalMessages` returns `null`. */
  error?: string;
}

export interface AdditionalMessagesProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** Visual and layout mode for the strip. */
  type: AdditionalMessagesType;
  /** Single message (reply/edit) or first of forwarded list */
  message?: AdditionalMessagesMessage | null;
  /** For forward: array of forwarded messages (used for count) */
  messages?: unknown[];
  /** Card-style preview vs compact strip above a bubble. */
  isPreview?: boolean;
  /** Styling variant for backgrounds and text contrast. */
  color?: "accent" | "white";
  /** Renders close (X); click stops propagation. */
  onCloseFunc?: () => void;
  /** Sets root click handler and pointer cursor (non-preview layout). */
  onClickFunc?: () => void;
  /** Sender display name (e.g. "Reply to John") */
  senderName?: string;
  /** Slot for first attachment thumbnail */
  attachmentSlot?: ReactNode;
}
