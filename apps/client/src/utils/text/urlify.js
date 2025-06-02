import localforage from "localforage";

import store from "@store/store.js";
import { upsertMessage } from "@store/values/Messages.js";

import globalConstants from "@utils/global/constants";

const urlMetaTimers = {};
const URL_META_EXPIRE_MS = globalConstants.urlMetaDataExpire;

const getAndStoreUrlMetaData = async (mid, url) => {
  const token = localStorage.getItem("sessionId");
  const cacheKey = `url_meta_${url}`;
  const now = Date.now();

  try {
    const cached = await localforage.getItem(cacheKey);
    if (
      cached?.data &&
      cached?.created_at &&
      now - cached.created_at < URL_META_EXPIRE_MS
    ) {
      if (mid)
        store.dispatch(upsertMessage({ _id: mid, url_preview: cached.data }));
      return;
    }
    if (cached) await localforage.removeItem(cacheKey);
  } catch {}

  try {
    const res = await fetch(
      `${import.meta.env.VITE_URL_PREVIEW_CONNECT}/unfurl`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", "Session-Token": token },
        body: JSON.stringify({ url }),
      }
    );
    const data = await res.json();
    if (mid) store.dispatch(upsertMessage({ _id: mid, url_preview: data }));
    await localforage.setItem(cacheKey, { data, created_at: now });
  } catch {
  } finally {
    delete urlMetaTimers[mid];
  }
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
