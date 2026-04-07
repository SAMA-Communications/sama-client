import { MediaBlurHashProps } from "@elements/MediaBlurHash";

/** Attachment video metadata (URL, optional poster blur hash). */
export interface VideoData {
  file_name?: string;
  file_url?: string;
  file_blur_hash?: string;
}

/** Video tile with poster blur hash and optional native controls. */
export interface VideoViewProps {
  video?: VideoData;
  onClick?: () => void;
  isFullSize?: boolean;
  removePlayButton?: boolean;
  enableControls?: boolean;
  mediaBlurHashProps?: Partial<MediaBlurHashProps>;
}
