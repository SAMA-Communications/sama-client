import localforage from "localforage";

import store from "@store/store.js";
import { upsertMessage } from "@store/values/Messages.js";

import globalConstants from "@utils/global/constants";

const urlMetaTimers = {};
const URL_META_EXPIRE_MS = globalConstants.urlMetaDataExpire;

const urlMetaQueue = [];
let activeRequests = 0;
const MAX_PARALLEL_REQUESTS = globalConstants.urlMaxParallelRequests;

const processQueue = () => {
  while (activeRequests < MAX_PARALLEL_REQUESTS && urlMetaQueue.length > 0) {
    const { mid, url, resolve } = urlMetaQueue.shift();
    activeRequests++;
    getAndStoreUrlMetaData(mid, url).then((data) => {
      activeRequests--;
      processQueue();
      if (resolve) resolve(data);
    });
  }
};

const debounceAndEnqueueUrlMeta = (mid, url) => {
  return new Promise((resolve) => {
    if (urlMetaTimers[mid]) clearTimeout(urlMetaTimers[mid]);
    urlMetaTimers[mid] = setTimeout(() => {
      urlMetaQueue.push({ mid, url, resolve });
      processQueue();
    }, 300);
  });
};

function isValidMetaData(data) {
  return data && (data.description || data.image);
}

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
      return isValidMetaData(cached.data) ? "ok" : "invalid";
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
    return isValidMetaData(data) ? "ok" : "invalid";
  } catch {
    return "error";
  } finally {
    delete urlMetaTimers[mid];
  }
};

async function tryLoadFirstValidUrl(mid, matches) {
  for (let i = 0; i < matches.length; i++) {
    const status = await debounceAndEnqueueUrlMeta(mid, matches[i]);
    if (status === "ok") break;
  }
}

export function urlify(
  mid,
  inputText,
  color = "black",
  isNeedToLoadUrl = false
) {
  const matches = inputText.match(globalConstants.linksRegExp) || [];
  const parts = inputText.split(globalConstants.linksRegExp);

  if (isNeedToLoadUrl && matches.length && !urlMetaTimers[mid]) {
    tryLoadFirstValidUrl(mid, matches);
  }

  return parts.reduce((result, part, i) => {
    result.push(part);

    if (i < matches.length) {
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
