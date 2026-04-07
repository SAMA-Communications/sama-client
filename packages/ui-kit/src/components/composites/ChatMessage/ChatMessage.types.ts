import type { ReactNode } from "react";

import type { Message, User } from "types/samaWssModels";

import type { WrapperRootProps } from "@elements/WrapperRoot";

/**
 * Wire `Message` fields consumed by the `ChatMessage` component.
 *
 * - `_id` — stable id (`data-message-id`).
 * - `from` — sender user id (profile navigation).
 * - `body` — plain text; with `updated_at` drives “edited” label.
 * - `attachments` — when non-empty, host should pass `attachmentsNode`.
 * - `status` — delivery/read; only `"sent"` / `"read"` affect `MessageStatus` for current user.
 * - `t` — Unix timestamp (seconds) for clock in footer.
 * - `created_at` / `updated_at` — ISO strings.
 * - `cid` — conversation id.
 * - `forwarded_message_id` — when set, shows forwarded header.
 */
export interface ChatMessageMessage extends Pick<
  Message,
  | "_id"
  | "body"
  | "from"
  | "attachments"
  | "status"
  | "t"
  | "created_at"
  | "updated_at"
  | "cid"
  | "forwarded_message_id"
> {
  /** Optimistic or legacy id; used as React `key` when `_id` is not preferred. */
  old_id?: string;
  /** URL preview payload from API; not read by `ChatMessage` (for parent / data parity). */
  url_preview?: unknown;
}

export interface ChatMessageProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onContextMenu"> {
  message: ChatMessageMessage;
  /** Sender profile for avatar; `null` uses icon fallbacks inside `MessageUserIcon`. */
  sender: User | null;
  /** Current-user message: right-aligned bubble, accent colors, read ticks when applicable. */
  isCurrentUser: boolean;
  /** Quoted message shown above the bubble; `AdditionalMessages` reply strip. */
  repliedMessage?: ChatMessageMessage | null;
  /** Rendered message body (e.g. urlified text) */
  bodyContent: ReactNode;
  /** Rendered attachments (e.g. MediaAttachments) or null */
  attachmentsNode?: ReactNode;
  /** Rendered link preview (e.g. MessageLinkPreview) or null */
  linkPreviewNode?: ReactNode;
  /** Open user profile / card for the given user id (`message.from` on name/avatar tap). */
  onUserProfile?: (uid: string) => void;
  /**
   * Bubble: `copyType` is `"Text"` if `message.body` is truthy, else `null`.
   * Selection mode on bubble/root: third argument includes `{ message }` for menu actions.
   */
  onContextMenu?: (e: React.MouseEvent, copyType: string | null, externalProps?: Record<string, unknown>) => void;
  /** Multi-select: mark this message selected (root click when not selected). */
  onSelectClick?: (() => void) | null;
  /** Multi-select: clear selection (root click when selected). */
  onUnselectClick?: (() => void) | null;
  /** Invoked when the reply preview strip (`repliedMessage`) is activated. */
  onReplyClick?: () => void;
  /**
   * Reserved for visibility callbacks; not invoked by `ChatMessage` today — safe to omit.
   */
  onVisible?: (() => void) | null;
  /** After left-drag past `swipeReplyThreshold` (mobile only, with `isMobile`). */
  onSwipeReply?: () => void;
  /** Enables swipe-to-reply drag, stronger bubble tap feedback, and related mobile UX. */
  isMobile?: boolean;
  /** Visual selected state (checkbox + bubble tint). */
  isSelected?: boolean;
  /** Shows selection checkbox column; root click toggles select; context menu variant. */
  isSelectionMode?: boolean;
  /** With default `showTimestamp`, helps show the time row between distant messages. */
  isLongTimeBetweenMessages?: boolean;
  /** Previous list item is same author — hides default author row when `showAuthor` omitted. */
  isPrevMessageYours?: boolean;
  /** Next list item is same author — groups bubble shape and default timestamp visibility. */
  isNextMessageYours?: boolean;
  /**
   * Declared for list semantics; **not read** by `ChatMessage` — use `showAuthor` / `isPrevMessageYours` for the author row.
   */
  isBlockStart?: boolean;
  /** End of a same-author, same-calendar-day, non-system block */
  isBlockEnd?: boolean;
  /** Show sender name row (typically equals block start for user messages) */
  showAuthor?: boolean;
  /** Show inline sent time / read status row (independent of context menu meta) */
  showTimestamp?: boolean;
  /** Sender display name (e.g. "John Doe" or "Deleted account") */
  senderDisplayName?: string;
  /** Display name for the replied message sender (e.g. "Reply to John") */
  repliedMessageSenderName?: string;
  /** Min drag offset (px) to trigger onSwipeReply (default 50) */
  swipeReplyThreshold?: number;
  /** Optional handlers for the content bubble (e.g. mobile long-press) */
  onBubblePointerDown?: (e: React.PointerEvent) => void;
  onBubblePointerUp?: (e: React.PointerEvent) => void;
  onBubblePointerLeave?: (e: React.PointerEvent) => void;
  onBubbleClick?: (e: React.MouseEvent) => void;
  /** When true, sender avatar (MessageUserIcon) is not rendered. Shown by default. */
  hideUserIcon?: boolean;
}
