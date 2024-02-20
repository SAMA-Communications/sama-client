import store from "@store/store";
import jwtDecode from "jwt-decode";

export default function getUserInitials() {
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  if (!userInfo) {
    return "AA";
  }

  const currentUser = store.getState().participants.entities[userInfo._id];
  if (!currentUser || !Object.keys(currentUser).length) {
    return "AA";
  }

  const { first_name, last_name, login } = currentUser;
  if (first_name) {
    return last_name
      ? first_name.slice(0, 1) + last_name.slice(0, 1)
      : first_name.slice(0, 2);
  }

  return login.slice(0, 2).toUpperCase();
}
