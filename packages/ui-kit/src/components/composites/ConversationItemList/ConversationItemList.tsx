import InfiniteScroll from "react-infinite-scroll-component";
import { useCallback, useRef } from "react";

import { getAdapters } from "../../../adapters";

import { ConversationItem } from "../../elements/ConversationItem";

import { ConversationItemListProps } from "./ConversationItemList.types";

export const ConversationItemList = ({
  conversations,
  selectedConversation,
  additionalOnClickfunc,
}: // isHideDeletedUsers = false,
ConversationItemListProps) => {
  const { useConversations } = getAdapters();
  const { setSelectedConversation, storeNewConversations, fetchConversations } = useConversations();

  const convItemOnClickFunc = (cid: string) => {
    setSelectedConversation(cid);
    additionalOnClickfunc && additionalOnClickfunc(cid);
  };

  const needToGetMoreChats = useRef(true);
  const lastConversationRef = useCallback(() => {
    if (conversations.length === 0) return;
    fetchConversations({
      updated_at: { lt: conversations[conversations.length - 1].updated_at },
    }).then((conversations) => {
      if (!conversations.length) {
        needToGetMoreChats.current = false;
        return;
      }
      needToGetMoreChats.current = !(conversations.length < 10);
      storeNewConversations(conversations);
    });
  }, [conversations, needToGetMoreChats]);

  return (
    <InfiniteScroll
      dataLength={conversations.length}
      next={lastConversationRef}
      hasMore={true && needToGetMoreChats.current}
      scrollableTarget="conversationItemsScrollable"
      loader={undefined}
    >
      {conversations.map((obj) => (
        <ConversationItem
          key={obj._id}
          conversation={obj}
          onClick={() => convItemOnClickFunc(obj._id)}
          isSelected={selectedConversation?._id === obj._id}
        />
      ))}
    </InfiniteScroll>
  );
};
