export default function extractUserIdFromUrl(url) {
  const regex = /uid=([^\/&]*)/;
  const matches = url.match(regex);
  return matches && matches.length > 1 ? matches[1] : null;
}
