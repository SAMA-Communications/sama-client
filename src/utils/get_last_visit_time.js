export default function getLastVisitTime(timestamp) {
  if (!timestamp) {
    return null;
  }
  timestamp *= 1000;
  const now = Math.round(Date.now() / 1000) * 1000;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 86400000;
  const yearToStart = todayStart - 31556926000;
  const visitDate = new Date(timestamp);

  let baseMessage = "last visited ";
  const options = {
    hour: "2-digit",
    minute: "2-digit",
  };
  if (timestamp >= todayStart && timestamp <= now) {
    baseMessage += "at " + visitDate.toLocaleTimeString([], options);
  } else if (timestamp >= yesterdayStart && timestamp < todayStart) {
    baseMessage += "yesterday at " + visitDate.toLocaleTimeString([], options);
  } else if (timestamp >= yearToStart && timestamp < yesterdayStart) {
    baseMessage +=
      "on " +
      visitDate.toLocaleDateString([], {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
  } else {
    baseMessage += "a long time ago";
  }

  return baseMessage;
}
