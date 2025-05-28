const imageMimeTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/bmp",
  "image/heic",
];
const videoMimeTypes = ["video/mp4", "video/webm", "video/quicktime"];

const imageExtensions = ["jpeg", "jpg", "gif", "bmp", "png", "heic", "HEIC"];
const videoExtensions = ["mp4", "webm", "mov"];

export default function getFileType(fileName, mimeType) {
  if (mimeType) {
    if (imageMimeTypes.includes(mimeType)) {
      return "Image";
    }
    if (videoMimeTypes.includes(mimeType)) {
      return "Video";
    }
  }

  const fileExtension = fileName?.split(".").slice(-1)[0];
  if (imageExtensions.includes(fileExtension)) {
    return "Image";
  }
  if (videoExtensions.includes(fileExtension)) {
    return "Video";
  }

  return null;
}
