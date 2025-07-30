import { history } from "@utils/global/history";

export default function upsertMidsInPath(
  currentPath,
  mids = [],
  action = "add"
) {
  const midsRegex = /mids=\[([^\]]*)\]/;
  const match = currentPath.match(midsRegex);

  const existingMids = match
    ? match[1]
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  let updatedMids;

  switch (action) {
    case "add":
      updatedMids = Array.from(new Set([...existingMids, ...mids]));
      break;
    case "remove":
      updatedMids = existingMids.filter((mid) => !mids.includes(mid));
      break;
    case "all":
      updatedMids = mids;
      break;
    default:
      updatedMids = existingMids;
  }

  let newPath;

  if (match) {
    if (updatedMids.length > 0) {
      newPath = currentPath.replace(
        midsRegex,
        `mids=[${updatedMids.join(",")}]`
      );
    } else {
      newPath = currentPath.replace(/\/?selection\?mids=\[[^\]]*\]/, "");
    }
  } else {
    if (updatedMids.length > 0) {
      const insertBefore = "/info";
      const midsString = `mids=[${updatedMids.join(",")}]`;

      if (currentPath.includes(insertBefore)) {
        newPath = currentPath.replace(
          insertBefore,
          `${midsString}${insertBefore}`
        );
      } else {
        newPath = currentPath.endsWith("/")
          ? currentPath + midsString
          : currentPath + "/" + midsString;
      }
    } else {
      newPath = currentPath;
    }
  }

  history.navigate(newPath);
}
