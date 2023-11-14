export default function getPrevPage(link) {
  const arrayOfParts = link.split("/").slice(0, -1);

  const prevLink = arrayOfParts.join("/");

  return prevLink;
}
