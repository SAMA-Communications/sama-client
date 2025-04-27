import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import ConversationItemList from "@components/hub/chatList/ConversationItemList";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MenuButtons from "@components/info/elements/MenuButtons";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";

import SChatList from "@skeletons/hub/SChatList";

import { getDisplayableConversations } from "@store/values/Conversations.js";
import { getIsMobileView } from "@store/values/IsMobileView";

export default function ChatList() {
  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);

  const filteredConversations = useSelector(getDisplayableConversations);

  const chatsList = useMemo(() => {
    if (!filteredConversations) {
      return <SChatList />;
    }

    if (!filteredConversations.length) {
      return (
        <p className="mt-[10px] text-center text-[23px] text-(--color-text-light)">
          No chats are available.
        </p>
      );
    }

    return (
      <ConversationItemList
        id="conversationItemsScrollable"
        conversations={filteredConversations}
      />
    );
  }, [filteredConversations]);

  return (
    <section className="w-dvw mt-[5px] flex gap-[10px] flex-col justify-start items-center max-xl:flex-1 xl:w-[400px] md:max-xl:mb-[20px] md:max-xl:mr-[20px] ">
      {isMobileView ? <MenuButtons /> : null}
      <SearchInput
        customClassName="max-w-full"
        inputClassName="max-w-full"
        closeClassName="right-[25px]"
        shadowText={"Search"}
        setState={setInputText}
      />
      {inputText ? (
        <SearchBlock
          customClassName="w-full max-xl:px-[2svw] max-xl:pt-[2swh] max-xl:pb-[2px]"
          searchText={inputText}
          isClearInputText={true}
          clearInputText={() => setInputText(null)}
        />
      ) : (
        <CustomScrollBar
          customId={"conversationItemsScrollable"}
          customClassName="rounded-[8px] max-md:rounded-t-[16px] max-md:rounded-b-[0px] max-xl:rounded-[32px] max-xl:bg-(--color-bg-light)"
          childrenClassName="mt-[5px] flex flex-col gap-[5px] max-md:mt-[2svh] max-md:py-[0px] max-xl:px-[2svw] max-xl:pt-[10px] max-xl:pb-[20px]"
        >
          {chatsList}
        </CustomScrollBar>
      )}
    </section>
  );
}
