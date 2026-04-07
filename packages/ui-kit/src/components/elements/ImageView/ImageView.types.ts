import { MediaBlurHashProps } from "@elements/MediaBlurHash";

/** Attachment image metadata (URL, optional blur hash). */
export interface ImageData {
  file_name?: string;
  file_url?: string;
  file_blur_hash?: string;
}

/** Image tile with optional blur-hash overlay and click-to-open. */
export interface ImageViewProps {
  image?: ImageData;
  onClick?: () => void;
  isFullSize?: boolean;
  mediaBlurHashProps?: Partial<MediaBlurHashProps>;
}
