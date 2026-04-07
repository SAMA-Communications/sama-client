import { useCallback, useEffect, useRef } from "react";

import {
  afterLayoutStable,
  applyConversationAnchorScroll,
  buildChatListScrollSavePayload,
  commitScrollToBottom,
  commitScrollTop,
  readChatListScrollPersisted,
  reapplyChatListPendingScroll,
  writeChatListScrollPersisted,
} from "@utils/scrollPersistence";
import { CHAT_SCROLL_BOTTOM_THRESHOLD_PX } from "@utils/constants";

import {
  CHAT_LIST_POST_FETCH_DELAY_MS,
  CHAT_LIST_RESIZE_REAPPLY_DEBOUNCE_MS,
  CHAT_LIST_SCROLL_SUPPRESS_MS,
  isIosSafariLike,
} from "./chatListIos.js";

const SAVE_DEBOUNCE_MS = 150;
const CLAMP_EPS_PX = 2;
const EXTRA_FETCH_CAP = 48;
const CONTAINER_RAF_TRIES = 40;

/**
 * Conversation list scroll persistence. When `active` is false, effects no-op (shared hook entrypoint).
 */
export function useListPersistedScroll(active, p) {
  const pinnedBottomRef = useRef(false);
  const pendingScrollRef = useRef(null);
  const restoreDoneRef = useRef(false);
  const saveTimerRef = useRef(null);
  const hadSearchRef = useRef(false);
  const anchorRetryRef = useRef(null);
  const fetchCountRef = useRef(0);
  const loadingRef = useRef(false);
  const suppressReapplyUntilRef = useRef(0);
  const resizeReapplyTimerRef = useRef(null);

  const listScrollRef = p?.listScrollRef;
  const listInnerRef = p?.listInnerRef;
  const searchActive = p?.searchActive;
  const filteredConversations = p?.filteredConversations;
  const conversationCount = p?.conversationCount;
  const fetchConversations = p?.fetchConversations;
  const storeNewConversations = p?.storeNewConversations;

  const armScrollSuppress = useCallback((ms = CHAT_LIST_SCROLL_SUPPRESS_MS) => {
    suppressReapplyUntilRef.current = performance.now() + ms;
  }, []);

  useEffect(() => {
    if (!active) return;
    const hadSearch = hadSearchRef.current;
    hadSearchRef.current = searchActive;
    if (hadSearch && !searchActive) {
      restoreDoneRef.current = false;
      anchorRetryRef.current = null;
      fetchCountRef.current = 0;
    }
  }, [active, searchActive]);

  const runRestore = useCallback((container, persisted) => {
    if (!persisted) {
      commitScrollTop(container, 0);
      pinnedBottomRef.current = false;
      pendingScrollRef.current = null;
      anchorRetryRef.current = null;
      return;
    }

    if (persisted.v === 1 && persisted.legacyScrollTop != null) {
      const top = persisted.legacyScrollTop;
      const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
      commitScrollTop(container, Math.min(top, maxScroll));
      pendingScrollRef.current = { kind: "legacyTop", top };
      pinnedBottomRef.current = top >= maxScroll - CLAMP_EPS_PX;
      anchorRetryRef.current = null;
      return;
    }

    if (persisted.v === 2) {
      if (persisted.pb === true) {
        commitScrollToBottom(container);
        pinnedBottomRef.current = true;
        pendingScrollRef.current = null;
        anchorRetryRef.current = null;
        return;
      }

      const { cid, oy, sfb } = persisted;
      if (cid != null && oy != null) {
        const ok = applyConversationAnchorScroll(container, cid, oy);
        if (ok) {
          pendingScrollRef.current = { kind: "anchor", cid, oy };
          pinnedBottomRef.current = false;
          anchorRetryRef.current = null;
          return;
        }
        anchorRetryRef.current = { cid, oy };
        if (sfb != null && Number.isFinite(sfb)) {
          const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
          const desiredTop = Math.max(0, container.scrollHeight - container.clientHeight - sfb);
          commitScrollTop(container, Math.min(desiredTop, maxScroll));
          pendingScrollRef.current = { kind: "sfb", sfb };
        }
        pinnedBottomRef.current = false;
        return;
      }

      if (sfb != null && Number.isFinite(sfb)) {
        const maxScroll = Math.max(0, container.scrollHeight - container.clientHeight);
        const desiredTop = Math.max(0, container.scrollHeight - container.clientHeight - sfb);
        commitScrollTop(container, Math.min(desiredTop, maxScroll));
        pendingScrollRef.current = { kind: "sfb", sfb };
        pinnedBottomRef.current = sfb <= CHAT_SCROLL_BOTTOM_THRESHOLD_PX;
        anchorRetryRef.current = null;
      }
    }
  }, []);

  useEffect(() => {
    if (!active) return;
    if (searchActive) return;
    if (!filteredConversations?.length) return;
    if (restoreDoneRef.current) return;

    let cancelled = false;
    let attempts = 0;

    const tick = () => {
      if (cancelled) return;
      const container = listScrollRef.current;
      if (!container) {
        attempts += 1;
        if (attempts < CONTAINER_RAF_TRIES) requestAnimationFrame(tick);
        return;
      }
      const persisted = readChatListScrollPersisted();
      afterLayoutStable(() => {
        if (cancelled || !listScrollRef.current) return;
        runRestore(listScrollRef.current, persisted);
        restoreDoneRef.current = true;
        armScrollSuppress();
      });
    };

    requestAnimationFrame(tick);
    return () => {
      cancelled = true;
    };
  }, [active, armScrollSuppress, filteredConversations?.length, searchActive, runRestore, listScrollRef]);

  useEffect(() => {
    if (!active) return;
    if (searchActive || !restoreDoneRef.current) return;
    if (!filteredConversations?.length) return;
    const retry = anchorRetryRef.current;
    if (!retry || conversationCount === 0) return;
    const c = listScrollRef.current;
    if (!c) return;
    if (!filteredConversations.some((x) => x._id === retry.cid)) return;

    if (applyConversationAnchorScroll(c, retry.cid, retry.oy)) {
      anchorRetryRef.current = null;
      const { write, pending, pinnedBottom } = buildChatListScrollSavePayload(c);
      writeChatListScrollPersisted(write);
      pendingScrollRef.current = pending;
      pinnedBottomRef.current = pinnedBottom;
      armScrollSuppress();
    }
  }, [active, armScrollSuppress, conversationCount, filteredConversations, searchActive, listScrollRef]);

  useEffect(() => {
    if (!active) return;
    if (searchActive || !restoreDoneRef.current) return;
    const c = listScrollRef.current;
    if (!c || !filteredConversations?.length) return;
    if (loadingRef.current) return;
    if (fetchCountRef.current >= EXTRA_FETCH_CAP) return;

    const persisted = readChatListScrollPersisted();
    if (!persisted) return;

    const maxScroll = Math.max(0, c.scrollHeight - c.clientHeight);
    let needMore = false;
    if (persisted.v === 1 && persisted.legacyScrollTop != null) {
      needMore = persisted.legacyScrollTop > maxScroll + CLAMP_EPS_PX;
    } else if (persisted.v === 2 && persisted.pb !== true) {
      const sfb = persisted.sfb;
      if (sfb != null && Number.isFinite(sfb)) {
        const desiredTop = Math.max(0, c.scrollHeight - c.clientHeight - sfb);
        needMore = desiredTop > maxScroll + CLAMP_EPS_PX;
      } else if (persisted.cid != null && anchorRetryRef.current) {
        needMore = true;
      }
    }

    if (!needMore) return;

    loadingRef.current = true;
    fetchCountRef.current += 1;
    fetchConversations()
      .then((batch) => {
        if (!batch?.length) {
          fetchCountRef.current = EXTRA_FETCH_CAP;
          anchorRetryRef.current = null;
          return;
        }
        const el = listScrollRef.current;
        const prevH = el?.scrollHeight ?? 0;
        const prevTop = el?.scrollTop ?? 0;
        storeNewConversations(batch);
        const persistedAgain = readChatListScrollPersisted();
        const applyDelta = () => {
          const cont = listScrollRef.current;
          if (!cont) return;
          if (prevH > 0) {
            const delta = cont.scrollHeight - prevH;
            if (delta !== 0) commitScrollTop(cont, prevTop + delta);
          }
        };
        const finalizeRestore = () => {
          const cont = listScrollRef.current;
          if (!cont) return;
          if (persistedAgain) runRestore(cont, persistedAgain);
          armScrollSuppress();
        };
        afterLayoutStable(() => {
          applyDelta();
          if (isIosSafariLike()) {
            window.setTimeout(() => {
              afterLayoutStable(finalizeRestore);
            }, CHAT_LIST_POST_FETCH_DELAY_MS);
          } else {
            finalizeRestore();
          }
        });
      })
      .finally(() => {
        loadingRef.current = false;
      });
  }, [
    active,
    armScrollSuppress,
    conversationCount,
    fetchConversations,
    filteredConversations?.length,
    searchActive,
    runRestore,
    storeNewConversations,
    listScrollRef,
  ]);

  useEffect(() => {
    if (!active) return;
    if (searchActive) return;

    let cancelled = false;
    let ro = null;
    let rafAttempts = 0;
    const maxAttachAttempts = 90;

    const flushReapply = () => {
      resizeReapplyTimerRef.current = null;
      const c = listScrollRef.current;
      if (!c) return;
      if (performance.now() < suppressReapplyUntilRef.current) return;
      reapplyChatListPendingScroll(c, pendingScrollRef.current);
    };

    const onResize = () => {
      const c = listScrollRef.current;
      if (!c) return;
      if (pinnedBottomRef.current && restoreDoneRef.current) {
        if (resizeReapplyTimerRef.current != null) {
          clearTimeout(resizeReapplyTimerRef.current);
          resizeReapplyTimerRef.current = null;
        }
        commitScrollToBottom(c);
        return;
      }
      if (pinnedBottomRef.current) return;
      if (performance.now() < suppressReapplyUntilRef.current) return;
      if (resizeReapplyTimerRef.current != null) clearTimeout(resizeReapplyTimerRef.current);
      resizeReapplyTimerRef.current = window.setTimeout(flushReapply, CHAT_LIST_RESIZE_REAPPLY_DEBOUNCE_MS);
    };

    const tryAttach = () => {
      if (cancelled) return;
      const inner = listInnerRef.current;
      if (!inner) {
        rafAttempts += 1;
        if (rafAttempts < maxAttachAttempts) requestAnimationFrame(tryAttach);
        return;
      }
      ro = new ResizeObserver(onResize);
      ro.observe(inner);
      onResize();
    };

    tryAttach();
    return () => {
      cancelled = true;
      ro?.disconnect();
      if (resizeReapplyTimerRef.current != null) {
        clearTimeout(resizeReapplyTimerRef.current);
        resizeReapplyTimerRef.current = null;
      }
    };
  }, [active, searchActive, conversationCount, listScrollRef, listInnerRef]);

  const onPersist = useCallback(() => {
    if (!active) return;
    if (saveTimerRef.current != null) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveTimerRef.current = null;
      const container = listScrollRef.current;
      if (!container) return;
      const { write, pending, pinnedBottom } = buildChatListScrollSavePayload(container);
      writeChatListScrollPersisted(write);
      pendingScrollRef.current = pending;
      pinnedBottomRef.current = pinnedBottom;
    }, SAVE_DEBOUNCE_MS);
  }, [active, listScrollRef]);

  useEffect(
    () => () => {
      if (saveTimerRef.current != null) clearTimeout(saveTimerRef.current);
    },
    [],
  );

  return { onPersist };
}
