export default function buildHttpUrl() {
  const isSSL = process.env.NODE_ENV === "production";
  return `http${isSSL ? "s" : ""}://${
    process.env.REACT_APP_SOCKET_CONNECT.split("//")[1]
  }`;
}
