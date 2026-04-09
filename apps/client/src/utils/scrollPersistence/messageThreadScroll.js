import { REPLY_SCROLL_MAX_MS } from "../constants";

import {
  applyAnchorScrollByAttribute,
  findFirstVisibleAnchorByAttribute,
  readScrollPersisted,
  writeScrollPersisted,
} from "./core.js";

/**
 * Message thread scroll persistence (one saved position per open conversation).
 *
 * Storage: per-conversation v2 `{ pb, mid?, oy?, sfb? }` on `[data-message-id]`. `pb` means pinned
 * to the bottom of the thread (newest messages in view). Legacy per-thread key stored
 * distance-from-bottom as v1 `{ legacyFromBottom }`.
 *
 * Also includes helpers to scroll a message into view (reply / deep link).
 */

const MESSAGE_THREAD_V2_KEY_PREFIX = "chat_scroll_v2_";
const MESSAGE_THREAD_LEGACY_FROM_BOTTOM_PREFIX = "scroll_pos_";
const LEGACY_GLOBAL_CHAT_MESSAGES_SCROLL_KEY = "scroll_pos_chatMessagesScrollable";
const MESSAGE_ROW_ANCHOR = "data-message-id";

const SCROLL_INTO_VIEW_MAX_FRAMES = 200;
const SCROLL_INTO_VIEW_SETTLE_MS = 420;
const MESSAGE_VISIBILITY_MIN_RATIO = 0.38;
const MESSAGE_VISIBILITY_CAP_PX = 64;
const RESIZE_OBSERVER_MAX_FIRES = 5;

export function chatScrollV2StorageKey(conversationId) {
  return `${MESSAGE_THREAD_V2_KEY_PREFIX}${conversationId}`;
}

export function legacyChatScrollFromBottomKey(conversationId) {
  return `${MESSAGE_THREAD_LEGACY_FROM_BOTTOM_PREFIX}${conversationId}`;
}

export function readChatScrollPersisted(conversationId) {
  if (!conversationId) return null;
  return readScrollPersisted({
    v2StorageKey: chatScrollV2StorageKey(conversationId),
    legacyDistanceFromBottomKey: legacyChatScrollFromBottomKey(conversationId),
  });
}

export function writeChatScrollPersisted(conversationId, version2Payload) {
  if (!conversationId) return;
  writeScrollPersisted(
    {
      v2StorageKey: chatScrollV2StorageKey(conversationId),
      legacyKeysToRemove: [legacyChatScrollFromBottomKey(conversationId)],
    },
    version2Payload,
  );
}

export function removeLegacyGlobalChatScrollbarKey() {
  try {
    localStorage.removeItem(LEGACY_GLOBAL_CHAT_MESSAGES_SCROLL_KEY);
  } catch {}
}

export function applyAnchorScroll(scrollContainer, messageId, offsetFromViewportTopPx) {
  return applyAnchorScrollByAttribute(scrollContainer, messageId, offsetFromViewportTopPx, MESSAGE_ROW_ANCHOR);
}

export function findFirstVisibleMessageAnchor(scrollContainer) {
  const visible = findFirstVisibleAnchorByAttribute(scrollContainer, MESSAGE_ROW_ANCHOR);
  return visible ? { mid: visible.id, oy: visible.offsetFromViewportTopPx } : null;
}

export function isElementMostlyVisibleInScrollContainer(
  element,
  scrollContainer,
  minVisibleHeightRatio = MESSAGE_VISIBILITY_MIN_RATIO,
) {
  const scrollViewportRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const overlapTop = Math.max(scrollViewportRect.top, elementRect.top);
  const overlapBottom = Math.min(scrollViewportRect.bottom, elementRect.bottom);
  const visibleHeightPx = Math.max(0, overlapBottom - overlapTop);
  if (visibleHeightPx <= 0) return false;
  const thresholdPx = Math.min(elementRect.height * minVisibleHeightRatio, MESSAGE_VISIBILITY_CAP_PX);
  return visibleHeightPx >= thresholdPx;
}

/**
 * Repeatedly tries to center the message in the scroll container (handles async layout / resize).
 */
export function scrollChatMessageIntoViewReliable(scrollableContainer, columnResizeRoot, messageId) {
  return new Promise((resolve) => {
    if (!scrollableContainer || !messageId) {
      resolve(false);
      return;
    }

    const anchorAttribute = MESSAGE_ROW_ANCHOR;
    const startTimeMs = performance.now();
    let animationFrameId = 0;
    let settleTimeoutId = 0;
    let columnResizeObserver = null;
    let isFinished = false;

    const finish = (success) => {
      if (isFinished) return;
      isFinished = true;
      cancelAnimationFrame(animationFrameId);
      clearTimeout(settleTimeoutId);
      columnResizeObserver?.disconnect();
      resolve(success);
    };

    const queryMessageElement = () => {
      const safeId = CSS.escape(String(messageId));
      return scrollableContainer.querySelector(`[${anchorAttribute}="${safeId}"]`);
    };

    const scrollMessageIntoViewCentered = () => {
      const messageElement = queryMessageElement();
      if (!messageElement) return null;
      messageElement.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
      return messageElement;
    };

    const onResizeObserverTick = () => {
      let resizeObserverFireCount = 0;
      columnResizeObserver = new ResizeObserver(() => {
        const messageElementAgain = queryMessageElement();
        if (messageElementAgain) {
          messageElementAgain.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
        }
        resizeObserverFireCount += 1;
        if (resizeObserverFireCount >= RESIZE_OBSERVER_MAX_FIRES) {
          columnResizeObserver?.disconnect();
          columnResizeObserver = null;
        }
      });
      columnResizeObserver.observe(columnResizeRoot);
    };

    const tryNextAnimationFrame = (frameIndex) => {
      if (performance.now() - startTimeMs > REPLY_SCROLL_MAX_MS || frameIndex > SCROLL_INTO_VIEW_MAX_FRAMES) {
        const fallbackElement = queryMessageElement();
        if (fallbackElement) {
          fallbackElement.scrollIntoView({ block: "center", inline: "nearest", behavior: "auto" });
          finish(isElementMostlyVisibleInScrollContainer(fallbackElement, scrollableContainer));
        } else {
          finish(false);
        }
        return;
      }

      const messageElement = scrollMessageIntoViewCentered();
      if (messageElement && isElementMostlyVisibleInScrollContainer(messageElement, scrollableContainer)) {
        if (columnResizeRoot?.isConnected) {
          onResizeObserverTick();
        }
        settleTimeoutId = window.setTimeout(() => finish(true), SCROLL_INTO_VIEW_SETTLE_MS);
        return;
      }

      animationFrameId = requestAnimationFrame(() => tryNextAnimationFrame(frameIndex + 1));
    };

    animationFrameId = requestAnimationFrame(() => tryNextAnimationFrame(0));
  });
}
