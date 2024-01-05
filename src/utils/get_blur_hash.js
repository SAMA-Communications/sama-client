import { encode } from "blurhash";

export default async function encodeImageToBlurhash(imageUrl) {
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
