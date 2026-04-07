import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

import api from "@api/api";

import store from "@store/store.js";

import {
  applyAnchorScroll,
  findFirstVisibleMessageAnchor,
  readChatScrollPersisted,
  removeLegacyGlobalChatScrollbarKey,
  writeChatScrollPersisted,
} from "@utils/scrollPersistence";
import { CHAT_SCROLL_BOTTOM_THRESHOLD_PX } from "@utils/constants";

const SAVE_DEBOUNCE_MS = 150;

/**
 * Message thread scroll persistence. When `active` is false, effects no-op.
 */
export function useThreadPersistedScroll(active, p) {
  const columnRef = useRef(null);
  const pinnedRef = useRef(true);
  const pendingScrollRef = useRef(null);
  const restoreDoneRef = useRef(false);
  const saveTimerRef = useRef(null);
  const loadAroundReplyRef = useRef(p?.loadMessagesAroundReply);
  loadAroundReplyRef.current = p?.loadMessagesAroundReply;

  const scrollRef = p?.scrollRef;
  const conversationId = p?.conversationId;
  const messagesLength = p?.messagesLength;
  const lastMessageId = p?.lastMessageId;
  const setIsScrolling = p?.setIsScrolling;
  const setScrollDownVisible = p?.setScrollDownVisible;

  useEffect(() => {
    if (!active) return;
    removeLegacyGlobalChatScrollbarKey();
  }, [active]);

  useEffect(() => {
    if (!active) return;
    restoreDoneRef.current = false;
  }, [active, conversationId]);

  useEffect(() => {
    if (!active) return;
    if (!conversationId || !scrollRef?.current || !messagesLength) return;
    if (restoreDoneRef.current) return;

    const cidAtStart = conversationId;
    let cancelled = false;

    const finishPinned = () => {
      pinnedRef.current = true;
      pendingScrollRef.current = null;
      requestAnimationFrame(() => {
        if (cancelled || !scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        setIsScrolling(false);
      });
    };

    const applyPersisted = async () => {
      const persisted = readChatScrollPersisted(conversationId);

      if (!persisted) {
        finishPinned();
        return;
      }

      if (persisted.v === 1 && persisted.legacyFromBottom != null) {
        const sfb = persisted.legacyFromBottom;
        pinnedRef.current = sfb <= CHAT_SCROLL_BOTTOM_THRESHOLD_PX;
        pendingScrollRef.current = pinnedRef.current ? null : { kind: "sfb", sfb };
        requestAnimationFrame(() => {
          if (cancelled || !scrollRef.current) return;
          const c = scrollRef.current;
          c.scrollTop = Math.max(0, c.scrollHeight - c.clientHeight - sfb);
          setIsScrolling(false);
        });
        return;
      }

      if (persisted.pb === true) {
        finishPinned();
        return;
      }

      const { mid, oy, sfb } = persisted;
      if (mid != null && oy != null) {
        let rMessage = store.getState().messages.entities[mid];
        if (!rMessage) {
          const batch = await api.messageList({ cid: conversationId, ids: [mid], limit: 1 });
          rMessage = batch[0];
        }
        if (cancelled) return;
        if (rMessage) {
          const mids = store.getState().conversations.entities[cidAtStart]?.messagesIds;
          const inList = mids?.includes(rMessage._id);
          if (!inList) {
            await loadAroundReplyRef.current(rMessage);
          }
        }
        if (cancelled) return;
        pinnedRef.current = false;
        pendingScrollRef.current = { kind: "anchor", mid, oy };
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (cancelled || !scrollRef.current) return;
            applyAnchorScroll(scrollRef.current, mid, oy);
            setIsScrolling(false);
          });
        });
        return;
      }

      if (sfb != null && Number.isFinite(sfb)) {
        pinnedRef.current = false;
        pendingScrollRef.current = { kind: "sfb", sfb };
        requestAnimationFrame(() => {
          if (cancelled || !scrollRef.current) return;
          const c = scrollRef.current;
          c.scrollTop = Math.max(0, c.scrollHeight - c.clientHeight - sfb);
          setIsScrolling(false);
        });
        return;
      }

      finishPinned();
    };

    (async () => {
      await applyPersisted();
      if (!cancelled && store.getState().selectedConversation.value.id === cidAtStart) {
        restoreDoneRef.current = true;
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [active, conversationId, messagesLength, scrollRef, setIsScrolling]);

  useEffect(() => {
    if (!active) return;
    const col = columnRef.current;
    const container = scrollRef?.current;
    if (!col || !container) return;

    const ro = new ResizeObserver(() => {
      if (pinnedRef.current && restoreDoneRef.current) {
        container.scrollTop = container.scrollHeight;
        return;
      }
      if (pinnedRef.current) return;
      const pending = pendingScrollRef.current;
      if (!pending) return;
      if (pending.kind === "anchor") applyAnchorScroll(container, pending.mid, pending.oy);
      else if (pending.kind === "sfb")
        container.scrollTop = Math.max(0, container.scrollHeight - container.clientHeight - pending.sfb);
    });
    ro.observe(col);
    return () => ro.disconnect();
  }, [active, scrollRef, conversationId]);

  useLayoutEffect(() => {
    if (!active) return;
    const container = scrollRef?.current;
    if (!conversationId || !container || !lastMessageId || !restoreDoneRef.current) return;
    if (!pinnedRef.current) return;
    container.scrollTop = container.scrollHeight;
    requestAnimationFrame(() => {
      const el = scrollRef?.current;
      if (!el || !pinnedRef.current) return;
      el.scrollTop = el.scrollHeight;
    });
  }, [active, lastMessageId, conversationId, scrollRef]);

  const scrollToBottom = useCallback(() => {
    if (!active) return;
    setIsScrolling(true);
    const container = scrollRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
      setIsScrolling(false);
    }
    pinnedRef.current = true;
    pendingScrollRef.current = null;
    if (conversationId) writeChatScrollPersisted(conversationId, { pb: true });
  }, [active, scrollRef, conversationId, setIsScrolling]);

  const onScroll = useCallback(
    (distanceFromBottom) => {
      if (!active) return;
      pinnedRef.current = distanceFromBottom <= CHAT_SCROLL_BOTTOM_THRESHOLD_PX;
      setScrollDownVisible(distanceFromBottom > 200);

      if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        const container = scrollRef.current;
        if (!conversationId || !container) return;

        const sfb = container.scrollHeight - container.scrollTop - container.clientHeight;
        const atBottom = sfb <= CHAT_SCROLL_BOTTOM_THRESHOLD_PX;
        pinnedRef.current = atBottom;

        if (atBottom) {
          writeChatScrollPersisted(conversationId, { pb: true });
          pendingScrollRef.current = null;
        } else {
          const anchor = findFirstVisibleMessageAnchor(container);
          if (anchor) {
            writeChatScrollPersisted(conversationId, { pb: false, mid: anchor.mid, oy: anchor.oy });
            pendingScrollRef.current = { kind: "anchor", mid: anchor.mid, oy: anchor.oy };
          } else {
            writeChatScrollPersisted(conversationId, { pb: false, sfb });
            pendingScrollRef.current = { kind: "sfb", sfb };
          }
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [active, scrollRef, conversationId, setScrollDownVisible],
  );

  useEffect(
    () => () => {
      if (saveTimerRef.current !== null) clearTimeout(saveTimerRef.current);
    },
    [],
  );

  return { columnRef, onScroll, scrollToBottom };
}
