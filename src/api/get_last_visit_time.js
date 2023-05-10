export default function getLastVisitTime(timestamp) {
  if (!timestamp) {
    return null;
  }
  timestamp *= 1000;
  const now = Date.now();
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 24 * 60 * 60 * 1000;

  if (timestamp >= todayStart && timestamp <= now) {
    const visitTime = new Date(timestamp);
    return (
      "був у мережі о " +
      visitTime.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else if (timestamp >= yesterdayStart && timestamp < todayStart) {
    const visitTime = new Date(timestamp);
    return (
      "був у мережі вчора о " +
      visitTime.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    const visitDate = new Date(timestamp);
    return (
      "був у мережі " +
      visitDate.getDate() +
      " " +
      getMonthName(visitDate.getMonth())
    );
  }
}

export function getMonthName(monthIndex) {
  const monthNames = {
    0: "січня",
    1: "лютого",
    2: "березня",
    3: "квітня",
    4: "травня",
    5: "червня",
    6: "липня",
    7: "серпня",
    8: "вересня",
    9: "жовтня",
    10: "листопада",
    11: "грудня",
  };

  return monthNames[monthIndex];
}
