import compressFile from "@utils/media/compress_file";
import encodeImageToBlurhash from "@utils/media/get_blur_hash";
import globalConstants from "@utils/global/constants";

export default async function compressAndHashFile(
  file,
  maxSizeMB,
  maxWidthOrHeight
) {
  file = await compressFile(file, maxSizeMB, maxWidthOrHeight);
  const localFileUrl = URL.createObjectURL(file);
  file.localUrl = localFileUrl;

  try {
    file.blurHash = await encodeImageToBlurhash(localFileUrl);
  } catch (e) {
    file.blurHash = globalConstants.defaultBlurHash;
  }

  return file;
}
