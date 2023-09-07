import React, { useMemo, useRef, useState } from "react";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import ChatBox from "../../generic/ChatBox.js";
import UserSearch from "./UserSearch.js";
import UserProfile from "../../generic/UserProfile.js";
import { NavLink } from "react-router-dom";
import {
  addUsers,
  selectParticipantsEntities,
} from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
  upsertChat,
} from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/chat/ChatList.css";

import { ReactComponent as UserIcon } from "./../../../assets/icons/chatList/UserIcon.svg";
import { ReactComponent as MoreOptions } from "./../../../assets/icons/chatList/MoreOptions.svg";
import { ReactComponent as CreateChatButton } from "./../../../assets/icons/chatList/CreateChatButton.svg";

export default function ChatList({
  asideDisplayStyle,
  setAsideDisplayStyle,
  setChatFormBgDisplayStyle,
}) {
  const dispatch = useDispatch();
  const [isSearchForm, setIsSearchForm] = useState(false);
  const [isUserProfile, setIsUserProfile] = useState(false);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;
  const currentUserData = useMemo(
    () => (userInfo ? participants[userInfo._id] : {}),
    [userInfo, participants]
  );

  api.onConversationCreateListener = (chat) => {
    dispatch(
      upsertChat({ ...chat, unread_messages_count: 0, messagesIds: [] })
    );
    api
      .getParticipantsByCids([chat._id])
      .then((users) => dispatch(addUsers(users)));
  };

  const chatsList = useMemo(() => {
    let list = [];
    for (const obj of conversations) {
      const chatName = !obj.name
        ? obj.owner_id === userInfo._id
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

            setAsideDisplayStyle("none");
            setChatFormBgDisplayStyle("none");
          }}
        >
          <ChatBox
            chatName={chatName}
            timeOfLastUpdate={obj.updated_at}
            countOfNewMessages={obj.unread_messages_count}
            chatType={obj.type}
            lastMessage={obj.last_message}
            uId={userInfo._id}
          />
        </NavLink>
      );
    }
    return list;
  }, [conversations, participants, activeConv]);

  const openModal = () => setIsUserProfile(true);

  return (
    <aside style={{ display: asideDisplayStyle }}>
      <div className="user-box">
        <div className="user-photo">
          {currentUserData?.login.slice(0, 2).toUpperCase()}
        </div>
        <div className="user-info">
          <p className="user-info-name">{currentUserData?.login}</p>
          {/* <p className="user-info-status"></p> */}
        </div>
        <div className="user-options" onClick={openModal}>
          <MoreOptions />
        </div>
      </div>
      <div className="chat-list">
        {!Object.keys(conversations).length ? (
          <p className="empty-list">You haven't started any chats yet.</p>
        ) : (
          chatsList
        )}
        <div className="chat-create-btn" onClick={() => setIsSearchForm(true)}>
          <CreateChatButton />
        </div>
        {isSearchForm && <UserSearch close={setIsSearchForm} />}
        {isUserProfile && <UserProfile close={setIsUserProfile} />}
      </div>
    </aside>
  );
}
