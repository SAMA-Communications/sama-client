import type { ReactNode } from "react";
import type { Message, User } from "types/samaWssModels";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface ChatMessageMessage extends Pick<
  Message,
  "_id" | "body" | "from" | "attachments" | "status" | "t" | "created_at" | "updated_at" | "cid" | "forwarded_message_id"
> {
  old_id?: string;
  url_preview?: unknown;
}

export interface ChatMessageProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onContextMenu"> {
  message: ChatMessageMessage;
  sender: User | null;
  isCurrentUser: boolean;
  repliedMessage?: ChatMessageMessage | null;
  /** Rendered message body (e.g. urlified text) */
  bodyContent: ReactNode;
  /** Rendered attachments (e.g. MediaAttachments) or null */
  attachmentsNode?: ReactNode;
  /** Rendered link preview (e.g. MessageLinkPreview) or null */
  linkPreviewNode?: ReactNode;
  onUserProfile?: (uid: string) => void;
  onContextMenu?: (e: React.MouseEvent, copyType: string | null, externalProps?: Record<string, unknown>) => void;
  onSelectClick?: (() => void) | null;
  onUnselectClick?: (() => void) | null;
  onReplyClick?: () => void;
  onVisible?: (() => void) | null;
  onSwipeReply?: () => void;
  isMobile?: boolean;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  isLongTimeBetweenMessages?: boolean;
  isPrevMessageYours?: boolean;
  isNextMessageYours?: boolean;
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
}
