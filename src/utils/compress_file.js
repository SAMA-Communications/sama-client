import * as imageConversion from "image-conversion";

export default async function compressFile(file) {
  const compressedfile = await imageConversion.compress(file, 0.9);
  const formData = new FormData();
  formData.append("file", compressedfile, file.name);

  return formData.get("file");
}
