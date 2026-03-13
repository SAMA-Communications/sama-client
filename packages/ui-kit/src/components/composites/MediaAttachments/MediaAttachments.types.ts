import type { MediaAttachmentData } from "../../elements/MediaAttachment";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface MediaAttachmentsProps extends Omit<WrapperRootProps<"div">, "as" | "children" | "onContextMenu"> {
  attachments: MediaAttachmentData[];
  /** Optional message id (e.g. for cursor pointer styling) */
  mid?: string;
  maxWidth?: number | string | null;
  maxHeight?: number | string | null;
  removeFileFunc?: (index: number) => void;
  disableAnimation?: boolean;
  onContextMenu?: (e: React.MouseEvent, attachment: MediaAttachmentData) => void;
  /** Called when user clicks an attachment (e.g. open media viewer) */
  onOpenMedia?: (index: number) => void;
}
