import { history } from "@helpers/history";

export default function addSuffix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (isInclude) {
    return;
  }

  history.navigate(currentPath + pathname);
}
