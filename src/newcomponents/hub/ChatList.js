import ChatBox from "@newcomponents/hub/elements/ChatBox.js";
import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import React, { useMemo, useState } from "react";
import SearchBlock from "@newcomponents/search/SearchBlock";
import SearchInput from "@newcomponents/static/SearchBar";
import api from "@api/api.js";
import getUserFullName from "@utils/user/get_user_full_name";
import jwtDecode from "jwt-decode";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
} from "@store/values/Conversations.js";
import { useNavigate } from "react-router-dom";
import { selectParticipantsEntities } from "@store/values/Participants.js";
import { setSelectedConversation } from "@store/values/SelectedConversation.js";
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

  const chatsList = useMemo(
    () =>
      conversations.map((obj) => (
        <ChatBox
          key={obj._id}
          isSelected={activeConv === obj._id}
          onClickFunc={() => {
            dispatch(setSelectedConversation({ id: obj._id }));
            navigate(`/#${obj._id}`);
          }}
          chatName={
            obj.name ||
            getUserFullName(
              participants[
                obj[obj.owner_id === userInfo?._id ? "opponent_id" : "owner_id"]
              ] || {}
            )
          }
          chatObject={obj}
          currentUserId={userInfo?._id}
        />
      )),
    [conversations, participants, activeConv]
  );

  return (
    <div className="chat-list__container">
      <SearchInput shadowText={"Search"} setState={setInputText} />
      {inputText ? (
        <SearchBlock searchText={inputText} />
      ) : (
        <CustomScrollBar>{chatsList}</CustomScrollBar>
      )}
    </div>
  );
}
