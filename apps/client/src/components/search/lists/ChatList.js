import ConversationItemList from "@components/hub/chatList/ConversationItemList";

export default function ChatList({
  conversations,
  isShowTitle = true,
  isChatSearched,
}) {
  return (
    <>
      {isShowTitle ? (
        <div className="py-[6px] px-[18px] my-[3px] text-black text-p rounded-[8px] bg-(--color-hover-light)">
          Chats
        </div>
      ) : null}
      <ConversationItemList conversations={conversations} />
      <p className="text-center text-h6 text-(--color-text-dark)">
        {isChatSearched}
      </p>
    </>
  );
}
