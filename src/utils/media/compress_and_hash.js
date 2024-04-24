import globalConstants from "@helpers/constants";
import compressFile from "@utils/media/compress_file";
import encodeImageToBlurhash from "@utils/media/get_blur_hash";

export default async function compressAndHashFile(file) {
  file = await compressFile(file);
  const localFileUrl = URL.createObjectURL(file);
  file.localUrl = localFileUrl;

  try {
    file.blurHash = await encodeImageToBlurhash(localFileUrl);
  } catch (e) {
    file.blurHash = globalConstants.defaultBlurHash;
  }

  return file;
}
