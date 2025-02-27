import { history } from "@utils/global/history";

export default function addSuffix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (isInclude) {
    return;
  }

  const filteredCurrentPath =
    currentPath[currentPath.length - 1] === "/"
      ? currentPath.slice(0, -1)
      : currentPath;

  history.navigate(filteredCurrentPath + pathname);
}
