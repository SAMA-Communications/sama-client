import imageCompression from "browser-image-compression";

export default async function compressFile(file, maxSizeMB, maxWidthOrHeight) {
  const options = {
    maxSizeMB: maxSizeMB || 0.3,
    maxWidthOrHeight: maxWidthOrHeight || 1920,
    useWebWorker: true,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    const formData = new FormData();
    formData.append("file", compressedFile, file.name);
    return formData.get("file");
  } catch (error) {
    console.error(error);
  }
}
