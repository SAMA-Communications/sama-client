import type { MediaAttachmentData } from "@elements/MediaAttachment";
import type { WrapperRootProps } from "@elements/WrapperRoot";

export interface MediaAttachmentsProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onContextMenu"> {
  attachments: MediaAttachmentData[];
  /** Optional message id (e.g. pointer / data attributes). */
  mid?: string;
  /** Max width for the grid (px, string, or null for default). */
  maxWidth?: number | string | null;
  /** Max height for the grid. */
  maxHeight?: number | string | null;
  /** Remove tile at index (e.g. trash on hover). */
  removeFileFunc?: (index: number) => void;
  /** Skip enter/exit motion on tiles. */
  disableAnimation?: boolean;
  /** Per-file context menu; not the native `div` handler. */
  onContextMenu?: (e: React.MouseEvent, attachment: MediaAttachmentData) => void;
  /** Open lightbox / viewer for attachment index. */
  onOpenMedia?: (index: number) => void;
}

