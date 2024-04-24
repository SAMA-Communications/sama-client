import globalConstants from "@helpers/constants";

export default function getLastUpdateTime(updatedAt, lastMessageObject) {
  const t = new Date(
    lastMessageObject
      ? lastMessageObject.t / 1000000000 < 10
        ? lastMessageObject.t * 1000
        : lastMessageObject.t
      : Date.parse(updatedAt)
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
      `${t.getMonth() < 10 ? "0" : ""}${t.getMonth() + 1}` +
      "." +
      t.getFullYear().toString().slice(2)
    );
  }

  return tToday.getDay() - t.getDay()
    ? globalConstants.weekDays[t.getDay()]
    : t.getHours() +
        ":" +
        (t.getMinutes() < 10 ? "0" + t.getMinutes() : t.getMinutes());
}
