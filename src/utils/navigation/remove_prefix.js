import { history } from "@helpers/history";

export default function removeAndNavigateSubLink(currentPath, pathname) {
  const escapedSubstring = pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escapedSubstring, "g");

  history.navigate(currentPath.replace(pattern, ""));
}
