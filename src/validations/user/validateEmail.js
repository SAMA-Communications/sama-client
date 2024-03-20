import showCustomAlert from "@utils/show_alert";

export default function validateEmail(email) {
  if (email && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
    showCustomAlert("The format of the email address is incorrect.", "warning");
    return true;
  }
  return false;
}
