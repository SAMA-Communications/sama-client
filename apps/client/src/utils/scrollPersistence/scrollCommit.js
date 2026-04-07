/**
 * WebKit / iOS Safari often ignores or rounds the first programmatic scrollTop until layout settles.
 * These helpers re-apply after microtask + animation frames and use scrollTo as a fallback.
 */

function clampedScrollTop(element, desiredTopPx) {
  const max = Math.max(0, element.scrollHeight - element.clientHeight);
  return Math.min(Math.max(0, desiredTopPx), max);
}

function applyScrollTop(element, desiredTopPx) {
  const y = clampedScrollTop(element, desiredTopPx);
  element.scrollTop = y;
  if (typeof element.scrollTo === "function") {
    try {
      element.scrollTo(0, y);
    } catch {
      element.scrollTo({ top: y, left: 0 });
    }
  }
}

/**
 * Set vertical scroll position (clamped). Safe for overflow scroll containers on mobile Safari.
 */
export function commitScrollTop(element, desiredTopPx) {
  if (!element || !Number.isFinite(desiredTopPx)) return;
  applyScrollTop(element, desiredTopPx);
  queueMicrotask(() => applyScrollTop(element, desiredTopPx));
  requestAnimationFrame(() => {
    applyScrollTop(element, desiredTopPx);
    requestAnimationFrame(() => applyScrollTop(element, desiredTopPx));
  });
}

/**
 * Scroll to the bottom (newest content at end of column). Uses repeated commits for iOS.
 */
export function commitScrollToBottom(element) {
  if (!element) return;
  const run = () => {
    const sh = element.scrollHeight;
    element.scrollTop = sh;
    if (typeof element.scrollTo === "function") {
      try {
        element.scrollTo(0, sh);
      } catch {
        element.scrollTo({ top: sh, left: 0 });
      }
    }
  };
  run();
  queueMicrotask(run);
  requestAnimationFrame(() => {
    run();
    requestAnimationFrame(run);
  });
}

/**
 * Runs after paint + next task; helps when scrollHeight is still updating (mobile WebKit).
 */
export function afterLayoutStable(callback) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(callback, 0);
    });
  });
}
