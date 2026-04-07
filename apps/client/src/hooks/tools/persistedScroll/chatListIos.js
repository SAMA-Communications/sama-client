/**
 * Chat list scroll tuning for WebKit on iPhone/iPad (not Chrome/Firefox on iOS).
 */
export function isIosSafariLike() {
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;
  const ua = navigator.userAgent;
  const iOS = /iP(ad|hone|od)/.test(ua);
  if (!iOS) return false;
  if (/CriOS|FxiOS|EdgiOS/.test(ua)) return false;
  return /WebKit/.test(ua);
}

/** Skip ResizeObserver reapply briefly after programmatic scroll (avoids fighting layout on iOS). */
export const CHAT_LIST_SCROLL_SUPPRESS_MS = 160;

/** Delay before re-reading layout after Redux append (Safari scrollHeight lags). */
export const CHAT_LIST_POST_FETCH_DELAY_MS = 48;

/** Coalesce ResizeObserver → reapply to reduce jumps when rows/images resize. */
export const CHAT_LIST_RESIZE_REAPPLY_DEBOUNCE_MS = 64;
