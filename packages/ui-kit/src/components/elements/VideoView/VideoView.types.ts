import { MediaBlurHashProps } from "../MediaBlurHash";

export interface VideoData {
  file_name?: string;
  file_url?: string;
  file_blur_hash?: string;
}

export interface VideoViewProps {
  video?: VideoData;
  onClick?: () => void;
  isFullSize?: boolean;
  removePlayButton?: boolean;
  enableControls?: boolean;
  mediaBlurHashProps?: Partial<MediaBlurHashProps>;
}
