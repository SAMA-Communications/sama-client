export default function chunkMedia(media) {
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
