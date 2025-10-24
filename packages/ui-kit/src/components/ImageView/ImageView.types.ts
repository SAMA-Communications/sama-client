import { MediaBlurHashProps } from "../MediaBlurHash";

export interface ImageData {
  file_name?: string;
  file_url?: string;
  file_blur_hash?: string;
}

export interface ImageViewProps {
  image?: ImageData;
  onClick?: () => void;
  isFullSize?: boolean;
  mediaBlurHashProps?: Partial<MediaBlurHashProps>;
}
