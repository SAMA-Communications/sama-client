import { REPLY_SCROLL_MAX_MS } from "./constants";

export function chatScrollV2StorageKey(cid) {
  return `chat_scroll_v2_${cid}`;
}

export function legacyChatScrollFromBottomKey(cid) {
  return `scroll_pos_${cid}`;
}

/**
 * v2 JSON in `chat_scroll_v2_${cid}`: { v:2, pb, mid?, oy?, sfb? }
 * - pb: pinned to bottom (newest)
 * - mid + oy: anchor message id and anchor top offset from viewport top (px)
 * - sfb: fallback distance from bottom when no anchor element
 */
export function readChatScrollPersisted(cid) {
  if (!cid) return null;
  try {
    const raw = localStorage.getItem(chatScrollV2StorageKey(cid));
    if (raw) {
      const o = JSON.parse(raw);
      if (o && o.v === 2) return o;
    }
  } catch (err) {}
  try {
    const leg = localStorage.getItem(legacyChatScrollFromBottomKey(cid));
    if (leg != null && leg !== "") {
      const n = Number(leg);
      if (!Number.isNaN(n)) return { v: 1, legacyFromBottom: n };
    }
  } catch (err) {}
  return null;
}

export function writeChatScrollPersisted(cid, partial) {
  if (!cid) return;
  localStorage.setItem(chatScrollV2StorageKey(cid), JSON.stringify({ v: 2, ...partial }));
  localStorage.removeItem(legacyChatScrollFromBottomKey(cid));
}

export function removeLegacyGlobalChatScrollbarKey() {
  localStorage.removeItem("scroll_pos_chatMessagesScrollable");
}

export function elementTopInScrollContainer(el, container) {
  return el.getBoundingClientRect().top - container.getBoundingClientRect().top + container.scrollTop;
}

export function applyAnchorScroll(container, mid, offsetFromViewportTop) {
  const el = container.querySelector(`[data-message-id="${mid}"]`);
  if (!el) return false;
  const oy = offsetFromViewportTop ?? 0;
  container.scrollTop = elementTopInScrollContainer(el, container) - oy;
  return true;
}

export function findFirstVisibleMessageAnchor(container) {
  const c = container.getBoundingClientRect();
  const nodes = container.querySelectorAll("[data-message-id]");
  for (const el of nodes) {
    const r = el.getBoundingClientRect();
    if (r.bottom <= c.top + 1) continue;
    if (r.top >= c.bottom) break;
    return { mid: el.getAttribute("data-message-id"), oy: r.top - c.top };
  }
  return null;
}

export function isElementMostlyVisibleInScrollContainer(el, scrollContainer, minRatio = 0.38) {
  const cr = scrollContainer.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const top = Math.max(cr.top, r.top);
  const bottom = Math.min(cr.bottom, r.bottom);
  const visible = Math.max(0, bottom - top);
  if (visible <= 0) return false;
  return visible >= Math.min(r.height * minRatio, 64);
}

export function scrollChatMessageIntoViewReliable(scrollableContainer, columnResizeRoot, mid) {
  return new Promise((resolve) => {
    if (!scrollableContainer || !mid) {
      resolve(false);
      return;
    }

    const t0 = performance.now();
    let rafId = 0;
    let settledTimer = 0;
    let ro = null;
    let done = false;

    const finish = (ok) => {
      if (done) return;
      done = true;
      cancelAnimationFrame(rafId);
      clearTimeout(settledTimer);
      ro?.disconnect();
      resolve(ok);
    };

    const scrollTarget = () => {
      const el = scrollableContainer.querySelector(`[data-message-id="${mid}"]`);
      if (!el) return null;
      el.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
      return el;
    };

    const tick = (frame) => {
      if (performance.now() - t0 > REPLY_SCROLL_MAX_MS || frame > 200) {
        const el = scrollableContainer.querySelector(`[data-message-id="${mid}"]`);
        if (el) {
          el.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
          finish(isElementMostlyVisibleInScrollContainer(el, scrollableContainer));
        } else {
          finish(false);
        }
        return;
      }

      const el = scrollTarget();
      if (el && isElementMostlyVisibleInScrollContainer(el, scrollableContainer)) {
        let resizeN = 0;
        if (columnResizeRoot?.isConnected) {
          ro = new ResizeObserver(() => {
            const again = scrollableContainer.querySelector(`[data-message-id="${mid}"]`);
            if (again) {
              again.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
            }
            resizeN += 1;
            if (resizeN >= 5) {
              ro?.disconnect();
              ro = null;
            }
          });
          ro.observe(columnResizeRoot);
        }
        settledTimer = window.setTimeout(() => finish(true), 420);
        return;
      }

      rafId = requestAnimationFrame(() => tick(frame + 1));
    };

    rafId = requestAnimationFrame(() => tick(0));
  });
}
