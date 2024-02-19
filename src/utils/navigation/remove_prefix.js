import { history } from "@helpers/history";

export default function removePrefix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (!isInclude) {
    return;
  }

  const newPath = currentPath
    .split("/")
    .filter((i) => i !== pathname.slice(1))
    .join("/");

  history.navigate(newPath);
}
