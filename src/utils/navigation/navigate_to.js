import { history } from "@helpers/history";

export default function navigateTo(pathname) {
  console.log(pathname);
  history.navigate(pathname);
}
