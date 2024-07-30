const cut = (text) => (text.length > 8 ? text.slice(0, 6) + "..." : text);

export default function getLastMessageUserName(userObject) {
  if (!userObject) {
    return null;
  }

  const { first_name, last_name, login } = userObject;

  if (!first_name && !last_name) {
    return login ? cut(login[0].toUpperCase() + login.slice(1)) : undefined;
  }

  const fullName = [first_name, last_name].filter(Boolean).join(" ");

  return last_name && fullName.length <= 10 ? fullName : cut(first_name);
}
