export default function getUserFullName(userObject) {
  if (!userObject) {
    return null;
  }

  const { first_name, last_name, login } = userObject;
  if (!first_name && !last_name) {
    return login ? login[0].toUpperCase() + login.slice(1) : undefined;
  }
  return last_name ? first_name + " " + last_name : first_name;
}
