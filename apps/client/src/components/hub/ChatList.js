import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router";

import { ConversationItemList } from "@sama-communications.ui-kit";

import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchInput";

import { CustomScrollBar } from "@sama-communications.ui-kit";

import SChatList from "@skeletons/hub/SChatList";

import { addPrefix } from "@utils/NavigationUtils.js";

import { getDisplayableConversations, getConverastionById } from "@store/values/Conversations.js";
import { getIsMobileView } from "@store/values/IsMobileView";

import { Settings, MessageCirclePlus } from "lucide-react";

export default function ChatList() {
  const { pathname, hash } = useLocation();
  const currentPath = pathname + hash;

  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);

  const selectedConversation = useSelector(getConverastionById);
  const filteredConversations = useSelector(getDisplayableConversations);

  const chatsList = useMemo(() => {
    if (!filteredConversations) {
      return <SChatList />;
    }

    if (!filteredConversations.length) {
      return <p className="text-text-dark text-center text-lg">No chats are available.</p>;
    }

    return (
      <ConversationItemList
        id="conversationItemsScrollable"
        selectedConversation={selectedConversation}
        conversations={filteredConversations}
      />
    );
  }, [filteredConversations, selectedConversation]);

  return (
    <section key="chaList" className="relative overflow-hidden xl:w-100">
      <div
        className="from-bg-light/90 absolute top-0 left-0 z-1 h-17 w-full bg-linear-to-b from-50% to-transparent"
        style={{ pointerEvents: "none" }}
      ></div>
      <div className="absolute top-3.5 left-0 z-2 flex w-full items-center gap-2.5 px-3.5">
        <button
          onClick={() => addPrefix(currentPath, "/profile")}
          className="border-text-dark hover:bg-text-dark/15 cursor-pointer rounded-xl border p-2 backdrop-blur-sm duration-150"
        >
          <Settings size={18} />
        </button>
        <SearchInput customClassName="flex-1" shadowText={"Search"} setState={setInputText} />
        <button
          onClick={() => addPrefix(pathname + hash, "/create")}
          className="border-text-dark hover:bg-text-dark/15 cursor-pointer rounded-xl border p-2 backdrop-blur-sm duration-150"
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
        <CustomScrollBar
          customId={"conversationItemsScrollable"}
          customClassName="cut-scrollbar-height h-[calc(100%+9px)]! "
          childrenClassName="pt-15 pb-1.5"
          onScrollStop={(container) =>
            localStorage.setItem(`scroll_pos_conversationItemsScrollable`, container.current.view.scrollTop)
          }
        >
          {chatsList}
        </CustomScrollBar>
      )}
    </section>
  );
}
