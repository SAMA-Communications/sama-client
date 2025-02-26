export default function buildHttpUrl(url: string): string {
  const isSSL: boolean = import.meta.env.PROD === true;
  return `http${isSSL ? "s" : ""}://${url.split("//")[1]}`;
}
