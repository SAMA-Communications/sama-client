import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion as m } from "framer-motion";

import ConversationItemList from "@components/hub/chatList/ConversationItemList";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MenuButtons from "@components/info/elements/MenuButtons";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchInput";

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
    <m.div
      key="chaList"
      className="flex flex-col relative gap-[10px] justify-start items-center max-xl:flex-1 xl:w-[400px] md:max-xl:mb-[20px]"
      initial={{ scale: 1, opacity: 0 }}
      animate={{
        scale: [1.02, 1],
        y: [3, 0],
        opacity: 1,
      }}
      exit={{
        opacity: [1, 0],
        x: [0, 15],
        transition: { duration: 0.5 },
      }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {isMobileView ? <MenuButtons /> : null}
      <SearchInput
        customClassName="max-w-full"
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
          customClassName="rounded-[8px] max-md:rounded-t-[16px] max-md:rounded-b-[0px] max-xl:rounded-[32px]"
          childrenClassName="flex flex-col gap-[5px] max-md:py-[0px] "
        >
          {chatsList}
        </CustomScrollBar>
      )}
    </m.div>
  );
}
