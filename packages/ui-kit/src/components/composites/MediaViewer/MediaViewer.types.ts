import type { MediaAttachmentData } from "../../elements/MediaAttachment";
import type { WrapperRootProps } from "../../elements/WrapperRoot";

export interface MediaViewerProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  /** List of attachments (image/video) */
  attachments: MediaAttachmentData[];
  /** Current index (0-based) */
  currentIndex: number;
  /** Called when user selects another index */
  onIndexChange: (index: number) => void;
  /** Called when user closes the viewer */
  onClose: () => void;
  /** Optional: custom file type resolver (fileName?, fileContentType?) => "Image" | "Video" | null */
  getFileType?: (fileName?: string | null, fileContentType?: string | null) => string | null;
  /** Mobile mode: show close button, click overlay to close */
  isMobile?: boolean;
  /** Optional ref for swipe area (touch) */
  swipeRef?: React.RefObject<HTMLDivElement | null>;
}
