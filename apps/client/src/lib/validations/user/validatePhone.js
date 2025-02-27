import showCustomAlert from "@utils/show_alert";

export default function validatePhone(phone) {
  if (phone && !/^(\+\d{2,14}|\d{3,15})$/.test(phone)) {
    showCustomAlert(
      "The phone number should be 3 to 15 digits in length.",
      "warning"
    );
    return true;
  }
  return false;
}
