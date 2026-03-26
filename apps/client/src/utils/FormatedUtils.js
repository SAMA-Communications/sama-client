let messageDateTimeHmFormatter;

function getMessageDateTimeHmFormatter() {
  if (!messageDateTimeHmFormatter) {
    messageDateTimeHmFormatter = new Intl.DateTimeFormat(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return messageDateTimeHmFormatter;
}

export function parseTimestampToEpochMs(timestamp) {
  if (timestamp == null) return NaN;
  if (typeof timestamp === "string") {
    const t = Date.parse(timestamp);
    return Number.isFinite(t) ? t : NaN;
  }
  if (typeof timestamp === "number") {
    if (!Number.isFinite(timestamp)) return NaN;
    return timestamp < 1e12 ? timestamp * 1000 : timestamp;
  }
  return NaN;
}

function startOfLocalDayMs(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function formatMessageDateTime(timestamp) {
  const ms = parseTimestampToEpochMs(timestamp);
  if (!Number.isFinite(ms)) return "—";

  const d = new Date(ms);
  const now = new Date();
  const dayDiff = Math.round((startOfLocalDayMs(d) - startOfLocalDayMs(now)) / 86400000);

  const hm = getMessageDateTimeHmFormatter().format(d);

  if (dayDiff === 0) return `today, ${hm}`;
  if (dayDiff === -1) return `yesterday, ${hm}`;

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);
  return `${dd}.${mm}.${yy}, ${hm}`;
}

export function getFormatedTime(dateParams) {
  const date = new Date(dateParams);
  const formattedDate = `${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")} ${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}.${date.getFullYear().toString().slice(-2)}`;

  return formattedDate;
}

export function calcInputHeight(text) {
  const countOfLines = text.split("\n").length - 1;
  return 28 + countOfLines * 20 < 230 ? 28 + countOfLines * 20 : 215;
}
