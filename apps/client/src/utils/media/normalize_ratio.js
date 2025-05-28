export default function normalizeRatio(ratio) {
  return Math.min(1.75, Math.max(0.25, ratio)) || 1;
}
