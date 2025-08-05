export default function extractForwardedMids(hash) {
  if (typeof hash !== "string") return [];

  const match = hash.match(/mids=\[([^\]]+)\]/);
  if (!match || !match[1]) return [];

  return match[1]
    .split(",")
    .map((mid) => mid.trim())
    .filter(Boolean);
}
