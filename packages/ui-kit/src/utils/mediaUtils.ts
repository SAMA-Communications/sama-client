/** Chunk media array into rows for layout (2–4 rows by length) */
export function chunkMedia<T>(media: T[]): T[][] {
  const len = media.length;
  if (len <= 2) return [media];
  if (len <= 5) return [media.slice(0, Math.ceil(len / 2)), media.slice(Math.ceil(len / 2))];
  if (len <= 9) return [media.slice(0, 3), media.slice(3, 6), media.slice(6)];
  return [media.slice(0, 3), media.slice(3, 6), media.slice(6, 9), media.slice(9)];
}

export function normalizeRatio(ratio: number): number {
  return Math.min(1.75, Math.max(0.25, ratio)) || 1;
}

const IMAGE_MIME = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/bmp", "image/heic"];
const VIDEO_MIME = ["video/mp4", "video/webm", "video/quicktime"];
const IMAGE_EXT = ["jpeg", "jpg", "gif", "bmp", "png", "heic", "HEIC"];
const VIDEO_EXT = ["mp4", "webm", "mov"];

export function getFileType(fileName?: string | null, mimeType?: string | null): "Image" | "Video" | null {
  if (mimeType) {
    if (IMAGE_MIME.includes(mimeType)) return "Image";
    if (VIDEO_MIME.includes(mimeType)) return "Video";
  }
  const ext = fileName?.split(".").slice(-1)[0];
  if (ext && IMAGE_EXT.includes(ext)) return "Image";
  if (ext && VIDEO_EXT.includes(ext)) return "Video";
  return null;
}
