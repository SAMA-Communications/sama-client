import { history } from "@helpers/history";

export default function navigateTo(pathname) {
  console.log("navigateTo:", pathname);
  history.navigate(pathname);
}
