import { useCallback, useRef, useState } from "react";

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
  const conversationsRef = useRef(conversations);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  hasMoreRef.current = hasMore;
  conversationsRef.current = conversations;

  const convItemOnClickFunc = useCallback(
    (cid: string) => {
      setSelectedConversation(cid);
      additionalOnClickfunc && additionalOnClickfunc(cid);
    },
    [additionalOnClickfunc, setSelectedConversation],
  );

  const loadMore = useCallback(() => {
    if (!hasMoreRef.current || isLoadingRef.current) return;
    const list = conversationsRef.current;
    const last = list[list.length - 1];
    if (!last) return;

    isLoadingRef.current = true;
    fetchConversations({
      updated_at: { lt: last.updated_at },
    })
      .then((batch) => {
        const el = scrollContainerRef.current;
        const prevScrollHeight = el?.scrollHeight ?? 0;
        const prevScrollTop = el?.scrollTop ?? 0;

        if (!batch.length) {
          hasMoreRef.current = false;
          setHasMore(false);
          return;
        }
        storeNewConversations(batch);

        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            const c = scrollContainerRef.current;
            if (!c || prevScrollHeight <= 0) return;
            const delta = c.scrollHeight - prevScrollHeight;
            if (delta !== 0) c.scrollTop = prevScrollTop + delta;
          });
        });
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
