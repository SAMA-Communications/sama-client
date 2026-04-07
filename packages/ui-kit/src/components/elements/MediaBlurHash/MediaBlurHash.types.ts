export type MediaStatus = "loading" | "error" | "success";

/** BlurHash canvas / loader overlay for images and video posters. */
export interface MediaBlurHashProps {
  status?: MediaStatus;
  blurHash?: string;
  loaderColor?: string;
  loaderSecondaryColor?: string;
  loaderSize?: number;
}
