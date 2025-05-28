export default function extractFilesFromClipboard(clipboardItems) {
  const files = [];
  if (clipboardItems?.items) {
    for (const item of clipboardItems.items) {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    }
  }
  return files;
}
