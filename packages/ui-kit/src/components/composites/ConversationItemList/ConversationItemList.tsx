import { useCallback, useLayoutEffect, useRef, useState } from "react";

import { clsx } from "clsx";

import { getAdapters } from "@adapters";

import type { ConversationItemListProps } from "@composites/ConversationItemList/ConversationItemList.types";
import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";

import { ConversationItem } from "@elements/ConversationItem";
import { WrapperRoot } from "@elements/WrapperRoot";

import { LOAD_MORE_EDGE_PX } from "@utils/constants";

function preserveScrollAfterAppendBelow(container: HTMLDivElement, prevScrollHeight: number, prevScrollTop: number) {
  if (prevScrollHeight <= 0) return;
  const delta = container.scrollHeight - prevScrollHeight;
  if (delta !== 0) container.scrollTop = prevScrollTop + delta;
}

export const ConversationItemList = ({
  conversations,
  selectedConversation,
  additionalOnClickfunc,
  className,
  scrollContainerRef: scrollContainerRefProp,
  listInnerRef: listInnerRefProp,
  disableBuiltinScrollPersistence = false,
  onListScrollFromBottom,
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
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const internalInnerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = scrollContainerRefProp ?? internalScrollRef;
  const listInnerRef = listInnerRefProp ?? internalInnerRef;
  const pendingScrollPreserveRef = useRef<{ prevScrollHeight: number; prevScrollTop: number } | null>(null);

  hasMoreRef.current = hasMore;

  useLayoutEffect(() => {
    const pending = pendingScrollPreserveRef.current;
    if (!pending) return;
    const container = scrollContainerRef.current;
    pendingScrollPreserveRef.current = null;
    if (!container) return;
    const copy = { ...pending };
    preserveScrollAfterAppendBelow(container, pending.prevScrollHeight, pending.prevScrollTop);
    requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (!el) return;
      preserveScrollAfterAppendBelow(el, copy.prevScrollHeight, copy.prevScrollTop);
    });
  }, [conversations.length]);

  const appendOlderChats = useCallback(() => {
    if (!hasMoreRef.current || isLoadingRef.current) return Promise.resolve();

    isLoadingRef.current = true;
    return fetchConversations()
      .then((batch) => {
        const el = scrollContainerRef.current;
        const prevScrollHeight = el?.scrollHeight ?? 0;
        const prevScrollTop = el?.scrollTop ?? 0;

        if (!batch.length) {
          hasMoreRef.current = false;
          setHasMore(false);
          return;
        }
        if (prevScrollHeight > 0) {
          pendingScrollPreserveRef.current = { prevScrollHeight, prevScrollTop };
        }
        storeNewConversations(batch);
      })
      .finally(() => {
        isLoadingRef.current = false;
      });
  }, [fetchConversations, storeNewConversations]);

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || isLoadingRef.current) return;
    void appendOlderChats();
  }, [appendOlderChats]);

  const onScrollNearBottom = useCallback(
    (scrollFromBottom: number) => {
      if (!hasMoreRef.current || isLoadingRef.current) return;
      if (scrollFromBottom > LOAD_MORE_EDGE_PX) return;
      loadMore();
    },
    [loadMore],
  );

  const mergedOnScroll = useCallback(
    (scrollFromBottom: number) => {
      onScrollNearBottom(scrollFromBottom);
      onListScrollFromBottom?.(scrollFromBottom);
    },
    [onListScrollFromBottom, onScrollNearBottom],
  );

  const convItemOnClickFunc = useCallback(
    (cid: string) => {
      setSelectedConversation(cid);
      additionalOnClickfunc && additionalOnClickfunc(cid);
    },
    [additionalOnClickfunc, setSelectedConversation],
  );

  return (
    <WrapperRoot className={clsx("ui:flex ui:h-full ui:min-h-0 ui:flex-col", className)} {...rest}>
      <CustomVerticalScrollbar
        containerRef={scrollContainerRef}
        customId={scrollContainerId}
        persistScrollPosition={!disableBuiltinScrollPersistence}
        customClassName={clsx("ui:min-h-0 ui:flex-1 ui:w-full", scrollbarClassName)}
        childrenClassName={scrollbarContentClassName}
        onScroll={mergedOnScroll}
      >
        <div ref={listInnerRef} className="ui:flex ui:w-full ui:min-w-0 ui:flex-col">
          {conversations.map((obj) => (
            <ConversationItem
              key={obj._id}
              conversation={obj}
              onClick={() => convItemOnClickFunc(obj._id)}
              isSelected={selectedConversation?._id === obj._id}
            />
          ))}
        </div>
      </CustomVerticalScrollbar>
    </WrapperRoot>
  );
};
