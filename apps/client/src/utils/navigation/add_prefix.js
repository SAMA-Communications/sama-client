import { history } from "@utils/global/history";

import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";

export default function addPrefix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (isInclude) {
    removeAndNavigateSubLink(currentPath, pathname);
    return;
  }
  history.navigate(pathname + currentPath);
}
