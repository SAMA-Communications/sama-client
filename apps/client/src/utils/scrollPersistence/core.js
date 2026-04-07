import { CHAT_SCROLL_BOTTOM_THRESHOLD_PX } from "../constants";

/**
 * Shared scroll persistence primitives for vertically scrollable lists.
 *
 * Covers: versioned localStorage (v2 JSON + v1 legacy numeric keys), DOM anchors via a data-attribute,
 * distance from bottom (`scrollFromBottomPx`), and rebuild of save payloads when “pinned” means
 * the user is near the bottom of the viewport (small `scrollFromBottomPx`).
 *
 * Message threads and the conversation list add their own storage keys and anchor attributes on top
 * of this module (`messageThreadScroll.js`, `conversationListScroll.js`).
 */

function scrollContainerMaxScrollTop(scrollContainer) {
  return Math.max(0, scrollContainer.scrollHeight - scrollContainer.clientHeight);
}

function parseVersion2Record(jsonString) {
  try {
    const parsed = JSON.parse(jsonString);
    return parsed && parsed.v === 2 ? parsed : null;
  } catch {
    return null;
  }
}

function readNumericLegacyLocalStorageValue(storageKey) {
  try {
    const rawValue = localStorage.getItem(storageKey);
    if (rawValue == null || rawValue === "") return null;
    const numericValue = Number(rawValue);
    return Number.isNaN(numericValue) ? null : numericValue;
  } catch {
    return null;
  }
}

export function readScrollPersisted(readOptions) {
  const { v2StorageKey, legacyDistanceFromBottomKey, legacyScrollTopKey } = readOptions;
  if (!v2StorageKey) return null;

  try {
    const rawVersion2Json = localStorage.getItem(v2StorageKey);
    if (rawVersion2Json) {
      const version2Record = parseVersion2Record(rawVersion2Json);
      if (version2Record) return version2Record;
    }
  } catch {}

  if (legacyDistanceFromBottomKey) {
    const legacyFromBottomPx = readNumericLegacyLocalStorageValue(legacyDistanceFromBottomKey);
    if (legacyFromBottomPx != null) return { v: 1, legacyFromBottom: legacyFromBottomPx };
  }

  if (legacyScrollTopKey) {
    const legacyScrollTopPx = readNumericLegacyLocalStorageValue(legacyScrollTopKey);
    if (legacyScrollTopPx != null) return { v: 1, legacyScrollTop: legacyScrollTopPx };
  }

  return null;
}

export function writeScrollPersisted(writeOptions, version2Payload) {
  const { v2StorageKey, legacyKeysToRemove = [] } = writeOptions;
  if (!v2StorageKey) return;
  try {
    localStorage.setItem(v2StorageKey, JSON.stringify({ v: 2, ...version2Payload }));
    for (const legacyKey of legacyKeysToRemove) {
      try {
        localStorage.removeItem(legacyKey);
      } catch {
        /* ignore per-key failures */
      }
    }
  } catch {}
}

export function elementTopInScrollContainer(element, scrollContainer) {
  return element.getBoundingClientRect().top - scrollContainer.getBoundingClientRect().top + scrollContainer.scrollTop;
}

export function applyAnchorScrollByAttribute(
  scrollContainer,
  anchorElementId,
  offsetFromViewportTopPx,
  anchorDataAttribute,
) {
  if (!anchorElementId || !scrollContainer) return false;
  let anchorElement;
  try {
    anchorElement = scrollContainer.querySelector(`[${anchorDataAttribute}="${CSS.escape(String(anchorElementId))}"]`);
  } catch {
    anchorElement = scrollContainer.querySelector(
      `[${anchorDataAttribute}="${String(anchorElementId).replace(/"/g, "")}"]`,
    );
  }
  if (!anchorElement) return false;
  const offsetPx = offsetFromViewportTopPx ?? 0;
  scrollContainer.scrollTop = elementTopInScrollContainer(anchorElement, scrollContainer) - offsetPx;
  return true;
}

export function findFirstVisibleAnchorByAttribute(scrollContainer, anchorDataAttribute) {
  const scrollViewportRect = scrollContainer.getBoundingClientRect();
  const candidateElements = scrollContainer.querySelectorAll(`[${anchorDataAttribute}]`);
  for (const candidateElement of candidateElements) {
    const candidateRect = candidateElement.getBoundingClientRect();
    if (candidateRect.bottom <= scrollViewportRect.top + 1) continue;
    if (candidateRect.top >= scrollViewportRect.bottom) break;
    const anchorId = candidateElement.getAttribute(anchorDataAttribute);
    if (anchorId) return { id: anchorId, offsetFromViewportTopPx: candidateRect.top - scrollViewportRect.top };
  }
  return null;
}

/**
 * Re-applies scroll after layout/resize. Anchor branch resolves id from `mid`, `cid`, or `id`.
 */
export function reapplyPendingScrollAfterResize(scrollContainer, pendingScrollState, anchorDataAttribute) {
  if (!scrollContainer || !pendingScrollState) return;
  if (pendingScrollState.kind === "anchor") {
    const anchorElementId = pendingScrollState.mid ?? pendingScrollState.cid ?? pendingScrollState.id;
    if (anchorElementId == null) return;
    applyAnchorScrollByAttribute(scrollContainer, anchorElementId, pendingScrollState.oy, anchorDataAttribute);
    return;
  }
  if (pendingScrollState.kind === "sfb") {
    scrollContainer.scrollTop = Math.max(0, scrollContainerMaxScrollTop(scrollContainer) - pendingScrollState.sfb);
    return;
  }
  if (pendingScrollState.kind === "legacyTop") {
    const maxScrollTop = scrollContainerMaxScrollTop(scrollContainer);
    scrollContainer.scrollTop = Math.min(pendingScrollState.top, maxScrollTop);
  }
}

export function buildPinnedBottomScrollSavePayload(scrollContainer, buildOptions) {
  const {
    bottomThresholdPx = CHAT_SCROLL_BOTTOM_THRESHOLD_PX,
    anchorDataAttribute,
    versionTwoAnchorIdField,
  } = buildOptions;
  const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
  const scrollFromBottomPx = scrollHeight - scrollTop - clientHeight;
  if (scrollFromBottomPx <= bottomThresholdPx) {
    return { write: { pb: true }, pending: null, pinnedBottom: true };
  }
  const visibleAnchor = findFirstVisibleAnchorByAttribute(scrollContainer, anchorDataAttribute);
  if (visibleAnchor) {
    const version2Write = {
      pb: false,
      oy: visibleAnchor.offsetFromViewportTopPx,
      sfb: scrollFromBottomPx,
      [versionTwoAnchorIdField]: visibleAnchor.id,
    };
    const pendingScrollState = {
      kind: "anchor",
      oy: visibleAnchor.offsetFromViewportTopPx,
      [versionTwoAnchorIdField]: visibleAnchor.id,
    };
    return { write: version2Write, pending: pendingScrollState, pinnedBottom: false };
  }
  return {
    write: { pb: false, sfb: scrollFromBottomPx },
    pending: { kind: "sfb", sfb: scrollFromBottomPx },
    pinnedBottom: false,
  };
}
