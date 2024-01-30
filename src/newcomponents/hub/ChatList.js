import ChatBox from "@newcomponents/hub/elements/ChatBox.js";
import React, { useMemo } from "react";
import api from "@api/api.js";
import jwtDecode from "jwt-decode";
import { NavLink } from "react-router-dom";
import { selectParticipantsEntities } from "@store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
} from "@store/Conversations.js";
import { setSelectedConversation } from "@store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";

import "@newstyles/hub/ChatList.css";
import SearchInput from "@newcomponents/static/SearchBar";

export default function ChatList() {
  const dispatch = useDispatch();

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
        <NavLink
          to={`/main/#${obj._id}`}
          key={obj._id}
          className={activeConv === obj._id ? "selected" : ""}
          onClick={async () => {
            dispatch(setSelectedConversation({ id: obj._id }));
            if (obj.unread_messages_count > 0) {
              dispatch(clearCountOfUnreadMessages(obj._id));
              api.markConversationAsRead({ cid: obj._id });
            }
          }}
        >
          <ChatBox
            chatName={chatName}
            timeOfLastUpdate={obj.updated_at}
            countOfNewMessages={obj.unread_messages_count}
            chatType={obj.type}
            lastMessage={obj.last_message}
            uId={userInfo?._id}
          />
        </NavLink>
      );
    }
    return list;
  }, [conversations, participants, activeConv]);

  return (
    <div className="chat-list__container">
      <SearchInput />
      {chatsList}
    </div>
  );
}
