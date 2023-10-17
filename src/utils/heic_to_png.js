import heic2any from "heic2any";

export default async function heicToPng(file) {
  const blob = new Blob([file], { type: "image/heic" });

  const pngBuffer = await heic2any({
    blob,
    // toType: "image/png",
    toType: "image/jpeg",
    quality: 0.5,
  });

  const pngBlob = new Blob([pngBuffer], { type: "image/jpeg" });
  const pngFile = new File([pngBlob], file.name, {
    type: "image/jpeg",
  });

  return pngFile;
}
