import { history } from "@helpers/history";

export default function removeAndNavigateLastSection(link) {
  const arrayOfParts = link.split("/").slice(0, -1);
  const prevLink = arrayOfParts.join("/");
  console.log("removeAndNavigateLastSection:", prevLink);
  history.navigate(prevLink);
}
