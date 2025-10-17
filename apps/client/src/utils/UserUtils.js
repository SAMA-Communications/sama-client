import jwtDecode from "jwt-decode";

import store from "@store/store";

import { DAY_IN_MS, YEAR_IN_MS } from "@utils/constants.js";

const cut = (text) => (text.length > 8 ? text.slice(0, 6) + "..." : text);

export function extractUserIdFromUrl(url) {
  const regex = /uid=([^\/&]*)/;
  const matches = url.match(regex);
  return matches && matches.length > 1 ? matches[1] : null;
}

export function getLastMessageUserName(userObject) {
  if (!userObject) {
    return null;
  }

  const { first_name, last_name, login } = userObject;

  if (!first_name && !last_name) {
    return login ? cut(login[0].toUpperCase() + login.slice(1)) : undefined;
  }

  const fullName = [first_name, last_name].filter(Boolean).join(" ");

  return last_name && fullName.length <= 10 ? fullName : cut(first_name);
}

export function getLastVisitTime(timestamp, userLocale) {
  if (!timestamp) {
    return null;
  }
  timestamp *= 1000;
  const now = Math.round(Date.now() / 1000) * 1000;
  const todayStart = new Date().setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - DAY_IN_MS;
  const yearToStart = todayStart - YEAR_IN_MS;
  const visitDate = new Date(timestamp);

  let baseMessage = "Last seen ";
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
        month: "numeric",
        day: "numeric",
      });
  } else {
    baseMessage += "a long time ago";
  }

  return baseMessage;
}

export function getUserFullName(userObject) {
  if (!userObject) {
    return null;
  }

  const { first_name, last_name, login } = userObject;
  if (!first_name && !last_name) {
    return login ? login[0].toUpperCase() + login.slice(1) : undefined;
  }
  return last_name ? first_name + " " + last_name : first_name;
}

export function getUserInitials(user) {
  const userInfo = user
    ? user
    : localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  if (!userInfo) {
    return "AA";
  }

  const userObject =
    store.getState().participants.entities[userInfo._id] || user;
  if (!userObject || !Object.keys(userObject).length || !userObject.login) {
    return "AA";
  }

  const { first_name, last_name, login } = userObject;
  if (first_name) {
    return last_name
      ? first_name.slice(0, 1) + last_name.slice(0, 1)
      : first_name.slice(0, 2);
  }

  return login.slice(0, 2).toUpperCase();
}
