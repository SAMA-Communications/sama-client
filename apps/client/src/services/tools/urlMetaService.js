import localforage from "localforage";

import store from "@store/store.js";
import { upsertMessage } from "@store/values/Messages.js";

import {
  LINKS_REGEXP,
  URL_METADATA_EXPIRE,
  URL_MAX_PARALLEL_REQUESTS,
} from "@utils/constants.js";

class UrlMetaService {
  urlMetaTimers = {};
  urlMetaQueue = [];
  activeRequests = 0;

  processQueue() {
    while (
      this.activeRequests < URL_MAX_PARALLEL_REQUESTS &&
      this.urlMetaQueue.length > 0
    ) {
      const { mid, url, resolve } = this.urlMetaQueue.shift();
      this.activeRequests++;
      this.getAndStoreUrlMetaData(mid, url).then((data) => {
        this.activeRequests--;
        this.processQueue();
        if (resolve) resolve(data);
      });
    }
  }

  debounceAndEnqueueUrlMeta(mid, url) {
    return new Promise((resolve) => {
      if (this.urlMetaTimers[mid]) clearTimeout(this.urlMetaTimers[mid]);
      this.urlMetaTimers[mid] = setTimeout(() => {
        this.urlMetaQueue.push({ mid, url, resolve });
        this.processQueue();
      }, 300);
    });
  }

  isValidMetaData(data) {
    return data && (data.description || data.image);
  }

  async getAndStoreUrlMetaData(mid, url, { force = false } = {}) {
    const token = localStorage.getItem("sessionId");
    const cacheKey = `url_meta_${url}`;
    const now = Date.now();

    if (!force) {
      try {
        const cached = await localforage.getItem(cacheKey);
        if (
          cached?.data &&
          cached?.created_at &&
          now - cached.created_at < URL_METADATA_EXPIRE
        ) {
          if (mid)
            store.dispatch(
              upsertMessage({ _id: mid, url_preview: cached.data })
            );
          return this.isValidMetaData(cached.data) ? "ok" : "invalid";
        }
        if (cached) await localforage.removeItem(cacheKey);
      } catch {}
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_URL_PREVIEW_CONNECT}/unfurl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Session-Token": token,
          },
          body: JSON.stringify({ url }),
        }
      );
      const data = await res.json();

      if (mid) store.dispatch(upsertMessage({ _id: mid, url_preview: data }));
      await localforage.setItem(cacheKey, { data, created_at: now });
      return this.isValidMetaData(data) ? "ok" : "invalid";
    } catch {
      return "error";
    } finally {
      delete this.urlMetaTimers[mid];
    }
  }

  async hardUrlify(mid, url) {
    const status = await this.getAndStoreUrlMetaData(mid, url, { force: true });
    console.log("[url.service] refresh preview link:", status);
  }

  async tryLoadFirstValidUrl(mid, matches) {
    for (let i = 0; i < matches.length; i++) {
      const status = await this.debounceAndEnqueueUrlMeta(mid, matches[i]);
      if (status === "ok") break;
    }
  }

  urlify(mid, inputText, color = "black", isNeedToLoadUrl = false) {
    const matches = inputText.match(LINKS_REGEXP) || [];
    const parts = inputText.split(LINKS_REGEXP);

    if (isNeedToLoadUrl && matches.length && !this.urlMetaTimers[mid]) {
      this.tryLoadFirstValidUrl(mid, matches);
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
}

const urlMetaService = new UrlMetaService();

export const hardUrlify = urlMetaService.hardUrlify.bind(urlMetaService);
export const urlify = urlMetaService.urlify.bind(urlMetaService);
