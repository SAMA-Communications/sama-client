import ChatBox from "@newcomponents/hub/elements/ChatBox.js";
import React, { useMemo, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import SearchBlock from "@newcomponents/search/SearchBlock";
import SearchInput from "@newcomponents/static/SearchBar";
import api from "@api/api.js";
import jwtDecode from "jwt-decode";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
} from "@store/Conversations.js";
import { useNavigate } from "react-router-dom";
import { selectParticipantsEntities } from "@store/Participants.js";
import { setSelectedConversation } from "@store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";

import "@newstyles/hub/ChatList.css";

export default function ChatList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputText, setInputText] = useState(null);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const chatsList = useMemo(() => {
    const list = [];
    for (const obj of conversations) {
      const chatName = !obj.name
        ? obj.owner_id === userInfo?._id
          ? participants[obj.opponent_id]?.login
          : participants[obj.owner_id]?.login
        : obj.name;

      list.push(
        <ChatBox
          key={obj._id}
          isSelected={activeConv === obj._id}
          onClickFunc={() => {
            dispatch(setSelectedConversation({ id: obj._id }));
            if (obj.unread_messages_count > 0) {
              dispatch(clearCountOfUnreadMessages(obj._id));
              api.markConversationAsRead({ cid: obj._id });
            }
            navigate(`/#${obj._id}`);
          }}
          chatName={chatName}
          timeOfLastUpdate={obj.updated_at}
          countOfNewMessages={obj.unread_messages_count}
          chatType={obj.type}
          lastMessage={obj.last_message}
          uId={userInfo?._id}
        />
      );
    }
    return list;
  }, [conversations, participants, activeConv]);

  return (
    <div className="chat-list__container">
      <SearchInput shadowText={"Search"} setState={setInputText} />
      {inputText ? (
        <SearchBlock searchText={inputText} />
      ) : (
        <Scrollbars
          autoHide
          autoHideTimeout={400}
          autoHideDuration={400}
          className="scroll-bar__outer-container"
        >
          {chatsList}
        </Scrollbars>
      )}
    </div>
  );
}
