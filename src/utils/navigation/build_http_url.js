export default function buildHttpUrl() {
  const isSSL = import.meta.env.PROD === true;
  return `http${isSSL ? "s" : ""}://${
    import.meta.env.VITE_SOCKET_CONNECT.split("//")[1]
  }`;
}
