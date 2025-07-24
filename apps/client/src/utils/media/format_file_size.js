export default function formatFileSize(sizeInKb) {
  if (sizeInKb >= 1024 * 1024) {
    return (sizeInKb / (1024 * 1024)).toFixed(1) + " Gb";
  } else if (sizeInKb >= 1024) {
    return (sizeInKb / 1024).toFixed(1) + " Mb";
  } else {
    return sizeInKb.toFixed(1) + " Kb";
  }
}
