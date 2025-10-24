import { showCustomAlert } from "@utils/GeneralUtils.js";

export function validateEmail(email) {
  if (
    email &&
    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)
  ) {
    showCustomAlert("The format of the email address is incorrect.", "warning");
    return true;
  }
  return false;
}

export function validateLogin(login) {
  return /[A-Za-z0-9_\-.@]{3,20}/.test(login);
}

export function validatePassword(password) {
  return /[A-Za-z0-9_\-.@]{3,20}/.test(password);
}

export function validatePhone(phone) {
  if (phone && !/^(\+\d{2,14}|\d{3,15})$/.test(phone)) {
    showCustomAlert(
      "The phone number should be 3 to 15 digits in length.",
      "warning"
    );
    return true;
  }
  return false;
}
