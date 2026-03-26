export interface UrlPreviewData {
  url: string;
  title?: string;
  siteName?: string;
  description?: string;
  images?: string[];
  favicons?: string[];
  file_name?: string;
  size?: number;
}

export type MessageLinkPreviewExpandDirection = "up" | "down";

export interface MessageLinkPreviewProps {
  urlData: UrlPreviewData | null | undefined;
  /** "white" | "accent" for styling */
  color?: "white" | "accent";
  onRefresh: (e: React.MouseEvent, url: string) => void;
  /** When true, show document layout (file icon + name + size) */
  isDocument?: boolean;
  /** Formatted file size string (e.g. "1.2 MB") when isDocument */
  formattedFileSize?: string;
  /** Expand rich preview toward the bubble (`up`) or downward (`down`). Default: `PREVIEW_EXPAND_DIRECTION`. */
  expandDirection?: MessageLinkPreviewExpandDirection;
}
