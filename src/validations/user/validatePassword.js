export default function validatePassword(password) {
  return /[A-Za-z0-9_\-.@]{3,20}/.test(password);
}
