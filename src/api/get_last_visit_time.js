export default function getLastVisitTime(timestamp) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const visitTime = new Date(timestamp * 1000);
  console.log(visitTime, today, yesterday);

  if (visitTime >= today) {
    return (
      "був у мережі о " +
      visitTime.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else if (visitTime >= yesterday) {
    return (
      "був у мережі вчора о " +
      visitTime.toLocaleTimeString("uk-UA", {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  } else {
    return (
      "був у мережі " +
      visitTime.getDate() +
      " " +
      getMonthName(visitTime.getMonth())
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
