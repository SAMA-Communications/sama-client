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
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  context.drawImage(image, 0, 0);
  const imageData = context.getImageData(0, 0, image.width, image.height);

  return encode(imageData.data, imageData.width, imageData.height, 4, 4);
}
