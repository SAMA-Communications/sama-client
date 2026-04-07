import { useCallback, useEffect, useRef, useState } from "react";

import { clsx } from "clsx";

import { getAdapters } from "@adapters";

import type { ConversationItemListProps } from "@composites/ConversationItemList/ConversationItemList.types";
import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";

import { ConversationItem } from "@elements/ConversationItem";
import { WrapperRoot } from "@elements/WrapperRoot";

import { LOAD_MORE_EDGE_PX } from "@utils/constants";

export const ConversationItemList = ({
  conversations,
  selectedConversation,
  additionalOnClickfunc,
  className,
  scrollContainerId = "conversationItemsScrollable",
  scrollbarClassName,
  scrollbarContentClassName,
  ...rest
}: ConversationItemListProps) => {
  const { useConversations } = getAdapters();
  const { setSelectedConversation, storeNewConversations, fetchConversations } = useConversations();

  const [hasMore, setHasMore] = useState(true);
  const isLoadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listScrollRoRef = useRef<ResizeObserver | null>(null);
  const listScrollRoIdleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  hasMoreRef.current = hasMore;

  useEffect(() => {
    return () => {
      listScrollRoRef.current?.disconnect();
      listScrollRoRef.current = null;
      if (listScrollRoIdleRef.current != null) {
        clearTimeout(listScrollRoIdleRef.current);
        listScrollRoIdleRef.current = null;
      }
    };
  }, []);

  const convItemOnClickFunc = useCallback(
    (cid: string) => {
      setSelectedConversation(cid);
      additionalOnClickfunc && additionalOnClickfunc(cid);
    },
    [additionalOnClickfunc, setSelectedConversation],
  );

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || isLoadingRef.current) return;

    isLoadingRef.current = true;
    fetchConversations()
      .then((batch) => {
        const el = scrollContainerRef.current;
        if (!el) {
          return;
        }

        const baseH = el.scrollHeight;
        const baseT = el.scrollTop;
        const clientH = el.clientHeight;

        if (!batch.length) {
          hasMoreRef.current = false;
          setHasMore(false);
          return;
        }

        if (baseH <= clientH) {
          storeNewConversations(batch);
          return;
        }

        listScrollRoRef.current?.disconnect();
        if (listScrollRoIdleRef.current != null) {
          clearTimeout(listScrollRoIdleRef.current);
          listScrollRoIdleRef.current = null;
        }

        const applyScrollAnchor = () => {
          const node = scrollContainerRef.current;
          if (!node) {
            return;
          }
          const h = node.scrollHeight;
          const ch = node.clientHeight;
          const maxTop = Math.max(0, h - ch);
          const nextTop = baseT + (h - baseH);
          node.scrollTop = Math.max(0, Math.min(nextTop, maxTop));
        };

        const scheduleRoDone = () => {
          if (listScrollRoIdleRef.current != null) {
            clearTimeout(listScrollRoIdleRef.current);
          }
          listScrollRoIdleRef.current = setTimeout(() => {
            listScrollRoRef.current?.disconnect();
            listScrollRoRef.current = null;
            listScrollRoIdleRef.current = null;
          }, 450);
        };

        storeNewConversations(batch);

        const ro = new ResizeObserver(() => {
          applyScrollAnchor();
          scheduleRoDone();
        });
        listScrollRoRef.current = ro;
        ro.observe(el);

        queueMicrotask(applyScrollAnchor);
        requestAnimationFrame(applyScrollAnchor);
        scheduleRoDone();
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }, [fetchConversations, storeNewConversations]);

  const onScrollNearBottom = useCallback(
    (scrollFromBottom: number) => {
      if (!hasMoreRef.current || isLoadingRef.current) return;
      if (scrollFromBottom > LOAD_MORE_EDGE_PX) return;
      loadMore();
    },
    [loadMore],
  );

  return (
    <WrapperRoot className={clsx("ui:flex ui:h-full ui:min-h-0 ui:flex-col", className)} {...rest}>
      <CustomVerticalScrollbar
        containerRef={scrollContainerRef}
        customId={scrollContainerId}
        customClassName={clsx("ui:min-h-0 ui:flex-1 ui:w-full", scrollbarClassName)}
        childrenClassName={scrollbarContentClassName}
        onScroll={onScrollNearBottom}
      >
        {conversations.map((obj) => (
          <ConversationItem
            key={obj._id}
            conversation={obj}
            onClick={() => convItemOnClickFunc(obj._id)}
            isSelected={selectedConversation?._id === obj._id}
          />
        ))}
      </CustomVerticalScrollbar>
    </WrapperRoot>
  );
};
