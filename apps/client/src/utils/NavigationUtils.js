import { history } from "@utils/history.js";

export function navigateTo(pathname) {
  history.navigate(pathname);
}

export function addPrefix(currentPath, pathname) {
  const isInclude = currentPath.includes(pathname);
  if (isInclude) {
    removeAndNavigateSubLink(currentPath, pathname);
    return;
  }
  history.navigate(pathname + currentPath);
}

export function addSuffix(currentPath, pathname) {
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

export function removeSectionAndNavigate(currentPath, section) {
  const regex = new RegExp(`${section}[^/]*`, "g");
  const newPath = currentPath.replace(regex, "").replace(/\/+/g, "/");
  history.navigate(newPath);
}

export function removeAndNavigateSubLink(currentPath, pathname) {
  const escapedSubstring = pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(escapedSubstring, "g");

  history.navigate(currentPath.replace(pattern, ""));
}

export function removeAndNavigateLastSection(link) {
  const arrayOfParts = link.split("/").slice(0, -1);
  const prevLink = arrayOfParts.join("/");
  history.navigate(prevLink);
}

export function upsertMidsInPath(currentPath, mids = [], action = "add") {
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

export default function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (const i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
