import type { WrapperRootProps } from "../WrapperRoot";

export interface MediaAttachmentData {
  file_id?: string;
  file_name?: string;
  file_url?: string;
  file_blur_hash?: string;
  file_content_type?: string;
  file_width?: number;
  file_height?: number;
}

export interface MediaAttachmentProps extends Omit<WrapperRootProps<"div">, "as" | "children"> {
  index: number;
  attachment: MediaAttachmentData;
  flexGrow: number;
  onClick?: () => void;
  onContextMenu?: (e: React.MouseEvent) => void;
  removeFileFunc?: (index: number) => void;
  disableAnimation?: boolean;
}
