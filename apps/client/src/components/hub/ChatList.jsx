import { useMemo, useState } from "react";

import { useLocation } from "react-router";

import { useSelector } from "react-redux";

import { Settings, MessageCirclePlus } from "lucide-react";

import SearchBlock from "@components/search/SearchBlock";

import { ChatListSkeleton, ConversationItemList, SearchInput } from "@sama-communications.ui-kit";

import { getDisplayableConversations, getConverastionById } from "@store/values/Conversations.js";

import { addPrefix } from "@utils/NavigationUtils.js";

export default function ChatList() {
  const { pathname, hash } = useLocation();
  const currentPath = pathname + hash;

  const [inputText, setInputText] = useState(null);

  const selectedConversation = useSelector(getConverastionById);
  const filteredConversations = useSelector(getDisplayableConversations);

  const chatsList = useMemo(() => {
    if (!filteredConversations) {
      return <ChatListSkeleton />;
    }

    if (!filteredConversations.length) {
      return <p className="text-text-dark text-center text-lg">No chats are available.</p>;
    }

    return <ConversationItemList selectedConversation={selectedConversation} conversations={filteredConversations} />;
  }, [filteredConversations, selectedConversation]);

  return (
    <aside key="chatList" className="relative h-dvh w-full min-w-[400px] overflow-hidden max-md:w-dvw max-md:min-w-0">
      {/* <div
        className="from-bg-light/90 absolute top-0 left-0 z-1 h-17 w-full bg-linear-to-b from-50% to-transparent"
        style={{ pointerEvents: "none" }}
      ></div> */}
      <div className="flex h-16 w-full items-center gap-2.5 px-3.5">
        <button
          onClick={() => addPrefix(currentPath, "/profile")}
          className="hover:bg-bg-dark shadow-btn cursor-pointer rounded-xl bg-white p-2 duration-150 hover:text-white"
        >
          <Settings size={18} />
        </button>
        <SearchInput customClassName="flex-1" placeholder="Search" setState={setInputText} />
        <button
          onClick={() => addPrefix(pathname + hash, "/create")}
          className="hover:bg-bg-dark shadow-btn cursor-pointer rounded-xl bg-white p-2 duration-150 hover:text-white"
        >
          <MessageCirclePlus size={18} />
        </button>
      </div>
      {inputText ? (
        <SearchBlock
          customClassName="w-full md:max-xl:!w-[400px] max-xl:px-[2svw]  max-xl:pt-[2swh] max-xl:pb-[2px]"
          searchText={inputText}
          isClearInputText={true}
          clearInputText={() => setInputText(null)}
        />
      ) : (
        <div className="h-[calc(100%-64px)]! min-h-0 px-1">{chatsList}</div>
      )}
    </aside>
  );
}
