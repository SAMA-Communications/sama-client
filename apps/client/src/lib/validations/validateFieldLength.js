import showCustomAlert from "@utils/show_alert";

export default function validateFieldLength(value, min, max, fieldName) {
  const length = value?.trim().length;
  if (length < min || length > max) {
    showCustomAlert(
      `The ${fieldName} length must be in the range from ${min} to ${max}.`,
      "warning"
    );
    return true;
  }
  return false;
}
