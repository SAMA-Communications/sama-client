export const generateSoftPastelGradient = (text: string): string => {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = (hash * 31 + text.charCodeAt(i)) | 0;
  }

  const hue = Math.abs(hash) % 360;

  const baseSaturation = 55;
  const baseLightness = 55;

  const delta = 10 + (Math.abs(hash) % 6);

  const direction = hash % 2 === 0 ? 1 : -1;

  const l1 = baseLightness;
  const l2 = Math.min(90, Math.max(70, baseLightness + delta * direction));

  return `linear-gradient(
    25deg,
    hsl(${hue}, ${baseSaturation}%, ${l1}%),
    hsl(${hue}, ${baseSaturation}%, ${l2}%)
  )`;
};
