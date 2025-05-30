import store from "@store/store.js";
import { upsertMessage } from "@store/values/Messages.js";

import globalConstants from "@utils/global/constants";

const urlMetaTimers = {};

const getAndStoreUrlMetaData = (mid, url) => {
  const token = localStorage.getItem("sessionId");
  fetch(import.meta.env.VITE_URL_PREVIEW_CONNECT + "/unfurl", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Session-Token": token },
    body: JSON.stringify({ url }),
  })
    .then((res) => res.json())
    .then((data) => {
      mid && store.dispatch(upsertMessage({ _id: mid, url_preview: data }));
      delete urlMetaTimers[mid];
    })
    .catch(() => {});
};

function debounceUrlMeta(mid, url) {
  if (urlMetaTimers[mid]) clearTimeout(urlMetaTimers[mid]);
  urlMetaTimers[mid] = setTimeout(() => getAndStoreUrlMetaData(mid, url), 300);
}

export function urlify(
  mid,
  inputText,
  color = "black",
  isNeedToLoadUrl = false
) {
  const matches = inputText.match(globalConstants.linksRegExp) || [];
  const parts = inputText.split(globalConstants.linksRegExp);

  let isFirstUrlLoaded = false;
  return parts.reduce((result, part, i) => {
    result.push(part);

    if (i < matches.length) {
      if (isNeedToLoadUrl && !isFirstUrlLoaded) {
        if (!urlMetaTimers[mid]) debounceUrlMeta(mid, matches[i]);
        isFirstUrlLoaded = true;
      }
      result.push(
        <a
          className={`text-${color} underline`}
          href={matches[i]}
          target="_blank"
          key={i}
        >
          {matches[i]}
        </a>
      );
    }

    return result;
  }, []);
}
