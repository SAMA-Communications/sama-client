export default function getLastVisitTime(timestamp) {
  if (!timestamp) {
    return null;
  }
  timestamp *= 1000;
  const now = Math.round(Date.now() / 1000) * 1000;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;
  const visitDate = new Date(timestamp);

  if (timestamp >= todayStart && timestamp <= now) {
    return (
      "last visited at " +
      //maybe replace to navigator.language
      visitDate.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else if (timestamp >= yesterdayStart && timestamp < todayStart) {
    return (
      "last visited yesterday at " +
      //maybe replace to navigator.language
      visitDate.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    return (
      "last visited on " +
      //maybe replace to navigator.language
      visitDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );
  }
}
