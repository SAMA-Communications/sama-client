import { CHAT_SCROLL_BOTTOM_THRESHOLD_PX } from "../constants";

import {
  applyAnchorScrollByAttribute,
  buildPinnedBottomScrollSavePayload,
  findFirstVisibleAnchorByAttribute,
  readScrollPersisted,
  reapplyPendingScrollAfterResize,
  writeScrollPersisted,
} from "./core.js";

/**
 * Conversation list scroll persistence (global list, not per-thread).
 *
 * Storage: v2 JSON with the same shape as threads (`pb`, anchor + `oy`, `sfb`), anchored on
 * `[data-conversation-id]`. Older chats load by scrolling down, so “pinned to bottom” means the
 * viewport is near the end of the loaded list (small distance from bottom).
 *
 * Legacy: raw `scrollTop` in a single key → v1 `{ legacyScrollTop }`.
 */

const CHAT_LIST_SCROLL_V2_KEY = "chat_list_scroll_v2";
const CHAT_LIST_LEGACY_SCROLL_TOP_KEY = "scroll_pos_conversationItemsScrollable";
const CONVERSATION_ROW_ANCHOR = "data-conversation-id";

export function chatListScrollV2Key() {
  return CHAT_LIST_SCROLL_V2_KEY;
}

export function legacyChatListScrollTopKey() {
  return CHAT_LIST_LEGACY_SCROLL_TOP_KEY;
}

export function readChatListScrollPersisted() {
  return readScrollPersisted({
    v2StorageKey: CHAT_LIST_SCROLL_V2_KEY,
    legacyScrollTopKey: CHAT_LIST_LEGACY_SCROLL_TOP_KEY,
  });
}

export function writeChatListScrollPersisted(version2Payload) {
  writeScrollPersisted(
    {
      v2StorageKey: CHAT_LIST_SCROLL_V2_KEY,
      legacyKeysToRemove: [CHAT_LIST_LEGACY_SCROLL_TOP_KEY],
    },
    version2Payload,
  );
}

export function applyConversationAnchorScroll(scrollContainer, conversationId, offsetFromViewportTopPx) {
  return applyAnchorScrollByAttribute(
    scrollContainer,
    conversationId,
    offsetFromViewportTopPx,
    CONVERSATION_ROW_ANCHOR,
  );
}

export function findFirstVisibleConversationAnchor(scrollContainer) {
  const visible = findFirstVisibleAnchorByAttribute(scrollContainer, CONVERSATION_ROW_ANCHOR);
  return visible ? { cid: visible.id, oy: visible.offsetFromViewportTopPx } : null;
}

export function reapplyChatListPendingScroll(scrollContainer, pendingScrollState) {
  reapplyPendingScrollAfterResize(scrollContainer, pendingScrollState, CONVERSATION_ROW_ANCHOR);
}

export function buildChatListScrollSavePayload(
  scrollContainer,
  bottomThresholdPx = CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
) {
  return buildPinnedBottomScrollSavePayload(scrollContainer, {
    bottomThresholdPx,
    anchorDataAttribute: CONVERSATION_ROW_ANCHOR,
    versionTwoAnchorIdField: "cid",
  });
}
