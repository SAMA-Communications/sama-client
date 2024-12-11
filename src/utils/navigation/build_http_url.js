export default function buildHttpUrl() {
  const isSSL = process.env.REACT_APP_DEVELOPMENT === "true";
  return `http${isSSL ? "" : "s"}://${
    process.env.REACT_APP_SOCKET_CONNECT.split("//")[1]
  }`;
}
