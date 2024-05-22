import showCustomAlert from "@utils/show_alert";

export default function validateEmail(email) {
  if (
    email &&
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
  ) {
    showCustomAlert("The format of the email address is incorrect.", "warning");
    return true;
  }
  return false;
}
