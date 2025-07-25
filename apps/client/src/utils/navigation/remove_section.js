import { history } from "@utils/global/history";

export default function removeSectionAndNavigate(currentPath, section) {
  const regex = new RegExp(`${section}[^/]*`, "g");
  const newPath = currentPath.replace(regex, "").replace(/\/+/g, "/");
  history.navigate(newPath);
}
