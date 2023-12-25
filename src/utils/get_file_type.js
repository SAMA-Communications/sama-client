export default function getFileType(fileName) {
  const fileExtension = fileName.split(".").slice(-1)[0];

  if (
    ["jpeg", "jpg", "gif", "bmp", "png", "heic", "HEIC"].includes(fileExtension)
  ) {
    return "Image";
  }

  if (["mp4", "webm", "mov"].includes(fileExtension)) {
    return "Video";
  }

  return null;
}
