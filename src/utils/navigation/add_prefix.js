import { history } from "@helpers/history";

export default function addPrefix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (isInclude) {
    return;
  }
  console.log("addPrefix:", pathname + currentPath);
  history.navigate(pathname + currentPath);
}
