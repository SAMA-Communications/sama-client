import ConversationItemList from "@src/components/hub/elements/ConversationItemList";

export default function ChatList({
  conversations,
  isShowTitle = true,
  isChatSearched,
}) {
  return (
    <>
      {isShowTitle && conversations.length ? (
        <div className="search__list-title">Chats</div>
      ) : null}
      <ConversationItemList conversations={conversations} />
      <p className="search__text">{isChatSearched}</p>
    </>
  );
}
