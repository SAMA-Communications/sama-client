export default function getLastVisitTime(timestamp, userLocale) {
  if (!timestamp) {
    return null;
  }
  timestamp *= 1000;
  const now = Math.round(Date.now() / 1000) * 1000;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 86400000;
  const yearToStart = todayStart - 31556926000;
  const visitDate = new Date(timestamp);

  let baseMessage = "Last visited ";
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  if (timestamp >= todayStart && timestamp <= now) {
    baseMessage += "at " + visitDate.toLocaleTimeString(userLocale, options);
  } else if (timestamp >= yesterdayStart && timestamp < todayStart) {
    baseMessage +=
      "yesterday at " + visitDate.toLocaleTimeString(userLocale, options);
  } else if (timestamp >= yearToStart && timestamp < yesterdayStart) {
    baseMessage +=
      "on " +
      visitDate.toLocaleDateString(userLocale, {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  } else {
    baseMessage += "a long time ago";
  }

  return baseMessage;
}
