import showCustomAlert from "@utils/show_alert";

export default function validatePhone(phone) {
  if (phone && !/^[0-9]{3,15}$/.test(phone)) {
    showCustomAlert(
      "The phone number should be 3 to 15 digits in length.",
      "warning"
    );
    return true;
  }
  return false;
}
