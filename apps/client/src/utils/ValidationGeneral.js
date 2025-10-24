import { showCustomAlert } from "@utils/GeneralUtils.js";

export function validateFieldLength(value, min, max, fieldName) {
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

export function validateIsEmptyObject(obj) {
  const keys = Object.keys(obj);
  if (!keys.length) {
    return true;
  }

  let isValueEmpty = true;
  keys.forEach((key) => !!obj[key]?.trim() && (isValueEmpty = false));

  return isValueEmpty;
}
