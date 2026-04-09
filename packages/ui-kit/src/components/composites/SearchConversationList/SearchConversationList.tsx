import { MessageCircle } from "lucide-react";

import { SearchConversationListProps } from "@composites/SearchConversationList/SearchConversationList.types";

import { ConversationItem } from "@elements/ConversationItem";

export const SearchConversationList = ({
  conversations,
  selectedConversationId,
  onConversationClick,
  showTitle = true,
  emptyMessage,
}: SearchConversationListProps) => {
  return (
    <>
      {showTitle ? (
        <div className="ui:mx-2 ui:my-0.5 ui:mt-1 ui:flex ui:items-center ui:gap-1.75 ui:rounded-xl ui:bg-bg-dark/5 ui:p-2 ui:text-sm ui:text-text-dark">
          <MessageCircle size={18} /> Chats
        </div>
      ) : null}
      {conversations.map((conv) => (
        <ConversationItem
          key={conv._id}
          conversation={conv}
          isSelected={selectedConversationId === conv._id}
          onClick={() => onConversationClick(conv._id)}
        />
      ))}
      {emptyMessage ? <p className="ui:pt-2 ui:text-center ui:text-text-dark">{emptyMessage}</p> : null}
    </>
  );
};

