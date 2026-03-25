import { FIFTEEN_MIN_MS, FIVE_MIN_MS, MAX_MESSAGES_WITHOUT_TIMESTAMP } from "@utils/constants";

export function messageEpochMs(message, kind) {
  if (kind === "updated") {
    const ua = message?.updated_at;
    if (ua == null) return NaN;
    const n = typeof ua === "number" ? ua : Date.parse(String(ua));
    return Number.isFinite(n) ? n : NaN;
  }
  if (message?.t != null && Number.isFinite(Number(message.t))) {
    return Number(message.t) * 1000;
  }
  const ca = message?.created_at;
  if (ca == null) return NaN;
  const n = typeof ca === "number" ? ca : Date.parse(String(ca));
  return Number.isFinite(n) ? n : NaN;
}

export function formatEpochMs(ms, formatter) {
  if (!Number.isFinite(ms)) return "—";
  return formatter.format(new Date(ms));
}

export function computeMessageChatLayouts(messages) {
  const n = messages.length;
  const layouts = [];
  let lastTimestampShownAt = null;
  let messagesSinceLastTimestamp = 0;

  const sentMs = (m) => messageEpochMs(m, "sent");
  const isSystem = (m) => m.x?.type != null && m.x.type !== "";
  const dayKey = (ms) => {
    const d = new Date(ms);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  };
  const sameUserBlock = (a, b) =>
    !isSystem(a) && !isSystem(b) && a.from === b.from && dayKey(sentMs(a)) === dayKey(sentMs(b));

  for (let i = 0; i < n; i++) {
    const cur = messages[i];
    const prev = i > 0 ? messages[i - 1] : undefined;
    const next = i < n - 1 ? messages[i + 1] : undefined;
    const curMs = sentMs(cur);
    const system = isSystem(cur);

    let isBlockStart;
    let isBlockEnd;

    if (system) {
      isBlockStart = true;
      isBlockEnd = true;
    } else {
      isBlockStart = i === 0 || prev === undefined || !sameUserBlock(prev, cur);
      isBlockEnd = i === n - 1 || next === undefined || !sameUserBlock(cur, next);
    }

    const showAuthor = !system && isBlockStart;

    if (system || isBlockStart) messagesSinceLastTimestamp = 0;

    let showTimestamp;
    if (i === 0) {
      showTimestamp = true;
    } else {
      const prevMs = sentMs(prev);
      const timeDiffPrev = curMs - prevMs;
      const timeSinceLastTimestamp =
        lastTimestampShownAt === null ? Number.POSITIVE_INFINITY : curMs - lastTimestampShownAt;

      showTimestamp =
        isBlockEnd ||
        timeDiffPrev >= FIVE_MIN_MS ||
        timeSinceLastTimestamp >= FIFTEEN_MIN_MS ||
        (!system && messagesSinceLastTimestamp >= MAX_MESSAGES_WITHOUT_TIMESTAMP);
    }

    if (showTimestamp) {
      lastTimestampShownAt = curMs;
      messagesSinceLastTimestamp = 0;
    } else {
      messagesSinceLastTimestamp++;
    }

    layouts.push({ isBlockStart, isBlockEnd, showAuthor, showTimestamp });
  }

  return layouts;
}
