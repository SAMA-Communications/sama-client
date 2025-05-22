import compressAndHashFile from "@utils/media/compress_and_hash";
import encodeImageToBlurhash from "@utils/media/get_blur_hash.js";
import extractFirstFrame from "@utils/media/extract_first_frame.js";
import globalConstants from "@utils/global/constants";
import heicToPng from "@utils/media/heic_to_png";

export default async function processFile(
  fileObj,
  maxSizeMB,
  maxWidthOrHeight
) {
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
    const pngFile = await compressAndHashFile(tmp, maxSizeMB, maxWidthOrHeight);

    return pngFile;
  }

  if (file.type.startsWith("image/")) {
    file = await compressAndHashFile(file, maxSizeMB, maxWidthOrHeight);

    const image = new Image();
    image.src = file.localUrl;
    file.width = image.width;
    file.height = image.height;
  }

  if (file.type.startsWith("video/")) {
    file.localUrl = URL.createObjectURL(file);

    try {
      const firstFrameUrl = await extractFirstFrame(file);
      file.blurHash = firstFrameUrl
        ? await encodeImageToBlurhash(firstFrameUrl)
        : globalConstants.defaultBlurHash;
    } catch (e) {
      file.blurHash = globalConstants.defaultBlurHash;
    }

    const video = document.createElement("video");
    video.src = file.localUrl;
    await new Promise((resolve) => {
      video.onloadedmetadata = () => {
        file.width = video.videoWidth;
        file.height = video.videoHeight;
        resolve();
      };
    });
  }

  return file;
}
