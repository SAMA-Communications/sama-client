export default async function getFileSize(url) {
  return ((await fetch(url)).headers.get("Content-Length") / 1000000).toFixed(
    2
  );
}
