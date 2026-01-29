export type MediaStatus = "loading" | "error" | "success";

export interface MediaBlurHashProps {
  status?: MediaStatus;
  blurHash?: string;
  loaderColor?: string;
  loaderSecondaryColor?: string;
  loaderSize?: number;
}
