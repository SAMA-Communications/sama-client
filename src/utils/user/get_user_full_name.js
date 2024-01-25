export default function getUserFullTime(userObject) {
  const { first_name, last_name, login } = userObject;
  if (!first_name && !last_name) {
    return login[0].toUpperCase() + login.slice(1);
  }
  return last_name ? first_name + " " + last_name : first_name;
}
