import { ConversationItemList } from "@sama-communications.ui-kit";

export default function ChatList({
  conversations,
  isShowTitle = true,
  isChatSearched,
  isHideDeletedUsers,
  additionalOnClickfunc,
}) {
  return (
    <>
      {isShowTitle ? (
        <div className="text-p my-[3px] rounded-[8px] bg-(--color-hover-light) px-[18px] py-[6px] text-black">
          Chats
        </div>
      ) : null}
      <ConversationItemList
        conversations={conversations}
        // isHideDeletedUsers={isHideDeletedUsers}
        additionalOnClickfunc={additionalOnClickfunc}
      />
      <p className="text-h6 text-center text-(--color-text-dark)">{isChatSearched}</p>
    </>
  );
}
