import ConversationItemList from "@components/hub/elements/ConversationItemList";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MenuButtons from "@components/info/elements/MenuButtons";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";
import { getDisplayableConversations } from "@store/values/Conversations.js";
import { getIsMobileView } from "@store/values/IsMobileView";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { motion as m } from "framer-motion";
import { animateConversationList } from "@src/animations/animateConversationIList";

import "@styles/hub/ChatList.css";

import SChatList from "@skeletons/hub/SChatList";

export default function ChatList() {
  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);

  const filteredConversations = useSelector(getDisplayableConversations);

  const chatsList = useMemo(() => {
    if (!filteredConversations) {
      return <SChatList />;
    }

    if (!filteredConversations.length) {
      return <p className="chat-list__empty">No chats are available.</p>;
    }

    return <ConversationItemList conversations={filteredConversations} />;
  }, [filteredConversations]);

  return (
    <m.div
      className="chat-list__container"
      variants={animateConversationList}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {isMobileView ? <MenuButtons /> : null}
      <SearchInput
        shadowText={"Search"}
        setState={setInputText}
        isAnimate={true}
      />
      {inputText ? (
        <SearchBlock
          searchText={inputText}
          isClearInputText={true}
          clearInputText={() => setInputText(null)}
        />
      ) : (
        <CustomScrollBar>{chatsList}</CustomScrollBar>
      )}
    </m.div>
  );
}
