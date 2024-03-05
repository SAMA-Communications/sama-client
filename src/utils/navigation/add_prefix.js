import { history } from "@helpers/history";

export default function addPrefix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (isInclude) {
    return;
  }
  history.navigate(pathname + currentPath);
}
