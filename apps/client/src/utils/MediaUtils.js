import imageCompression from "browser-image-compression";
import { encode } from "blurhash";

import { ALLOWED_FILE_FORMATS, DEFAULT_BLUR_HASH } from "@utils/constants.js";

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

export function chunkMedia(media) {
  const len = media.length;
  if (len <= 2) return [media];
  if (len <= 5)
    return [
      media.slice(0, Math.ceil(len / 2)),
      media.slice(Math.ceil(len / 2)),
    ];
  if (len <= 9) return [media.slice(0, 3), media.slice(3, 6), media.slice(6)];
  return [
    media.slice(0, 3),
    media.slice(3, 6),
    media.slice(6, 9),
    media.slice(9),
  ];
}

export function extractFilesFromClipboard(clipboardItems) {
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

export function formatFileSize(sizeInKb) {
  if (sizeInKb >= 1024 * 1024) {
    return (sizeInKb / (1024 * 1024)).toFixed(1) + " Gb";
  } else if (sizeInKb >= 1024) {
    return (sizeInKb / 1024).toFixed(1) + " Mb";
  } else {
    return sizeInKb.toFixed(1) + " Kb";
  }
}

export async function getFileSize(url) {
  return ((await fetch(url)).headers.get("Content-Length") / 1000000).toFixed(
    2
  );
}

export function getFileType(fileName, mimeType) {
  if (mimeType) {
    if (imageMimeTypes.includes(mimeType)) return "Image";
    if (videoMimeTypes.includes(mimeType)) return "Video";
  }

  const fileExtension = fileName?.split(".").slice(-1)[0];
  if (imageExtensions.includes(fileExtension)) return "Image";
  if (videoExtensions.includes(fileExtension)) return "Video";

  return null;
}

export function isHeic(fileName) {
  return fileName.toLowerCase().endsWith(".heic");
}

export function normalizeRatio(ratio) {
  return Math.min(1.75, Math.max(0.25, ratio)) || 1;
}

export async function writeToCanvas(src) {
  return new Promise((res) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        res(blob);
      }, "image/png");
    };
  });
}

export async function processFile(fileObj, maxSizeMB, maxWidthOrHeight) {
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
    !ALLOWED_FILE_FORMATS.includes(file.type) &&
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
        : DEFAULT_BLUR_HASH;
    } catch (e) {
      file.blurHash = DEFAULT_BLUR_HASH;
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

async function compressAndHashFile(file, maxSizeMB, maxWidthOrHeight) {
  file = await compressFile(file, maxSizeMB, maxWidthOrHeight);
  const localFileUrl = URL.createObjectURL(file);
  file.localUrl = localFileUrl;

  try {
    file.blurHash = await encodeImageToBlurhash(localFileUrl);
  } catch (e) {
    file.blurHash = DEFAULT_BLUR_HASH;
  }

  return file;
}

async function compressFile(file, maxSizeMB, maxWidthOrHeight) {
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

async function encodeImageToBlurhash(imageUrl) {
  const loadImage = async (src) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (...args) => reject(args);
      img.src = src;
    });

  const image = await loadImage(imageUrl);

  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0, 32, 32);
  const imageData = context.getImageData(0, 0, 32, 32);

  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
}

async function extractFirstFrame(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    video.preload = "metadata";
    video.src = URL.createObjectURL(file);
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      video.currentTime = 0;
    };

    video.onseeked = () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const imageUrl = URL.createObjectURL(blob);
          resolve(imageUrl);
        } else {
          reject(new Error("Error on receiving the first frame."));
        }
      }, "image/jpeg");
    };

    video.onerror = (e) => {
      reject(new Error("Error on receiving the first frame."));
    };
  });
}
