export default function buildHttpUrl() {
  return `http${process.env.REACT_APP_DEVELOPMENT ? "" : "s"}://${
    process.env.REACT_APP_SOCKET_CONNECT.split("//")[1]
  }`;
}
