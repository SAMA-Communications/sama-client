import heic2any from "heic2any";

export default async function heicToPng(file) {
  const blob = new Blob([file], { type: "image/heic" });

  const pngBuffer = await heic2any({
    blob,
    toType: "image/png",
  });

  const pngBlob = new Blob([pngBuffer], { type: "image/png" });
  const pngFile = new File([pngBlob], file.name, {
    type: "image/png",
  });
  console.log(2);

  return pngFile;
}
