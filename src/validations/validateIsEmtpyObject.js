export default function validateIsEmptyObject(obj) {
  const keys = Object.keys(obj);
  if (!keys.length) {
    return true;
  }

  let isValueEmpty = true;
  keys.forEach((key) => !!obj[key]?.trim() && (isValueEmpty = false));

  return isValueEmpty;
}
