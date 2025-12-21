import { WEEK_DAYS } from "@utils/constants.js";

export function getLastUpdateTime(convUpdatedAt, lastMessageTime) {
  const t = new Date(
    lastMessageTime
      ? lastMessageTime / 1000000000 < 10
        ? lastMessageTime * 1000
        : lastMessageTime
      : Date.parse(convUpdatedAt)
  );
  const tToday = new Date(Date.now());

  if (
    tToday.getFullYear() - t.getFullYear() ||
    tToday.getMonth() - t.getMonth() ||
    tToday.getDate() - t.getDate() > 6
  ) {
    return (
      `${t.getDate() < 10 ? "0" : ""}${t.getDate()}` +
      "." +
      `${t.getMonth() < 9 ? "0" : ""}${t.getMonth() + 1}` +
      "." +
      t.getFullYear().toString().slice(2)
    );
  }

  return tToday.getDay() - t.getDay()
    ? WEEK_DAYS[t.getDay()]
    : t.getHours() +
        ":" +
        (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes());
}

export function extractForwardedMids(hash) {
  if (typeof hash !== "string") return [];

  const match = hash.match(/mids=\[([^\]]+)\]/);
  if (!match || !match[1]) return [];

  return match[1]
    .split(",")
    .map((mid) => mid.trim())
    .filter(Boolean);
}

export function getOpponentId(chatObject, currentUserId) {
  return chatObject.opponent_id === currentUserId
    ? chatObject.owner_id
    : chatObject.opponent_id;
}
