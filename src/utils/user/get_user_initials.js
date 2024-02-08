import store from "@store/store";
import jwtDecode from "jwt-decode";

export default function getUserInitials(user) {
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
