import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import ChatBox from "../../generic/ChatBox.js";
import UserSearch from "./UserSearch.js";
import { NavLink } from "react-router-dom";
import {
  addUsers,
  selectParticipantsEntities,
  setUsers,
} from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  insertChats,
  selectAllConversations,
  upsertChat,
} from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";
import {
  changeOpacity,
  createChatButton,
  scaleAndRound,
} from "../../../styles/animations/animationBlocks.js";
import { motion as m } from "framer-motion";
import { default as EventEmitter } from "../../../event/eventEmitter.js";

import "../../../styles/chat/ChatList.css";

import { ReactComponent as UserIcon } from "./../../../assets/icons/chatList/UserIcon.svg";
import { ReactComponent as CreateChatButton } from "./../../../assets/icons/chatList/CreateChatButton.svg";

export default function ChatList() {
  const dispatch = useDispatch();
  const [isSearchForm, setIsSearchForm] = useState(false);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  api.onConversationCreateListener = (chat) => {
    dispatch(upsertChat(chat));
    api
      .getParticipantsByCids([chat._id])
      .then((users) => dispatch(addUsers(users)));
  };

  useEffect(() => {
    function getChatsAndParticipants() {
      api.conversationList({}).then((chats) => {
        if (!chats) {
          return;
        }
        dispatch(insertChats(chats));
        api
          .getParticipantsByCids(chats.map((obj) => obj._id))
          .then((users) => dispatch(setUsers(users)));
      });
    }
    getChatsAndParticipants();
    EventEmitter.subscribe("onConnect", getChatsAndParticipants);
  }, []);

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
          to={`/main/#${obj.name ? obj._id : chatName}`}
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
            uId={userInfo._id}
          />
        </NavLink>
      );
    }
    return list;
  }, [conversations, participants, activeConv]);

  return (
    <aside>
      <m.div
        variants={scaleAndRound(50, 0.1, 1.7, 0, 0.3)}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="user-box"
      >
        <m.div
          variants={changeOpacity(0.9, 1, 0, 0.15)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="user-photo"
        >
          {!userInfo ? <UserIcon /> : userInfo?.login.slice(0, 2).toUpperCase()}
        </m.div>
        <m.div
          variants={changeOpacity(0.9, 1, 0, 0.15)}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="user-info"
        >
          <p className="user-info-name">{userInfo?.login}</p>
          {/* <p className="user-info-status"></p> */}
        </m.div>
      </m.div>
      <m.div
        variants={scaleAndRound(50, 0.1, 1.7, 0, 0.3)}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="chat-list"
      >
        {!Object.keys(conversations).length ? (
          <m.p
            variants={changeOpacity(0.9, 1, 0, 0.15)}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="empty-list"
          >
            No one chat find...
          </m.p>
        ) : (
          chatsList
        )}
        <m.div
          variants={createChatButton}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="chat-create-btn"
          onClick={() => setIsSearchForm(true)}
        >
          <CreateChatButton />
        </m.div>
        {isSearchForm && <UserSearch close={setIsSearchForm} />}
      </m.div>
    </aside>
  );
}
