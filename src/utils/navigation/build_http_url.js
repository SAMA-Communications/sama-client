export default function buildHttpUrl() {
  return `http${process.env.IS_SSL ? "s" : ""}://${
    process.env.REACT_APP_SOCKET_CONNECT.split("//")[1]
  }`;
}
