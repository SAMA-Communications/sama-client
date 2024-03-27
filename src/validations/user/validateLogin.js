export default function validateLogin(login) {
  return /[A-Za-z0-9_\-.@]{3,20}/.test(login);
}
