import { history } from "@helpers/history";

export default function removeAndNavigateLastSection(link) {
  console.log(history.location, link, link.split("/"));
  const arrayOfParts = link.split("/").slice(0, -1);
  const prevLink = arrayOfParts.join("/");
  history.navigate(prevLink);
}
