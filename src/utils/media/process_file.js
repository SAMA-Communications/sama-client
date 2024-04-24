import globalConstants from "@helpers/constants";
import heicToPng from "@utils/media/heic_to_png";
import compressAndHashFile from "@utils/media/compress_and_hash";

export default async function processFile(fileObj) {
  const formData = new FormData();
  formData.append("file", fileObj, fileObj.name.toLocaleLowerCase());
  let file = formData.get("file");

  if (file.name.length > 255) {
    throw new Error("The file name should not exceed 255 characters.", {
      message: "The file name should not exceed 255 characters.",
    });
  }
  if (file.size > 104857600) {
    throw new Error("The file size should not exceed 100 MB.", {
      message: "The file size should not exceed 100 MB.",
    });
  }

  const fileExtension = file.name.split(".").slice(-1)[0];

  if (
    !globalConstants.allowedFileFormats.includes(file.type) &&
    !["heic", "HEIC"].includes(fileExtension)
  ) {
    throw new Error("Please select an image file.", {
      message: "Please select an image file.",
    });
  } else if (["heic", "HEIC"].includes(fileExtension)) {
    const tmp = await heicToPng(file);
    const pngFile = await compressAndHashFile(tmp);

    return pngFile;
  }

  if (file.type.startsWith("image/")) {
    file = await compressAndHashFile(file);
  }

  if (file.type.startsWith("video/")) {
    file.localUrl = URL.createObjectURL(file);
  }
  return file;
}
