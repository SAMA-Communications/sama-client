import React, { useEffect, useMemo, useState } from "react";
import UserSearch from "./UserSearch.js";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import { Link } from "react-router-dom";
import { VscComment, VscDeviceCamera } from "react-icons/vsc";
import {
  selectParticipantsEntities,
  setUsers,
} from "../../../store/Participants.js";
import {
  selectAllConversations,
  setChats,
} from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/chat/ChatList.css";
import ChatBox from "../../generic/ChatBox.js";
// import {
//   selectUnreadMessagesEntities,
//   setIndicators,
//   upsertIndicator,
// } from "../../../store/UnreadMessages.js";

export default function ChatList() {
  const dispatch = useDispatch();
  const [isSearchForm, setIsSearchForm] = useState(false);

  const conversations = useSelector(selectAllConversations);
  // const indicators = useSelector(selectUnreadMessagesEntities);
  const participants = useSelector(selectParticipantsEntities);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  useEffect(() => {
    setTimeout(() => {
      api.conversationList({}).then((chats) => {
        dispatch(setChats(chats));
        api
          .getParticipantsByCids(chats.map((obj) => obj._id))
          .then((users) => dispatch(setUsers(users)));
        // api.getCountOfUnreadMessages({ uId: userInfo._id }).then((indicators) =>
        //   dispatch(
        //     setIndicators(
        //       indicators.map((obj) => {
        //         return { cid: obj.conversation_id, count: obj.unread_messages };
        //       })
        //     )
        //   )
        // );
      });
    }, 300);
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
        <Link
          to={`/main/#${obj.name ? obj._id : chatName}`}
          key={obj._id}
          onClick={() => {
            dispatch(setSelectedConversation({ ...obj, name: chatName }));
            // dispatch(upsertIndicator({ cid: obj._id, count: 0 }));
            // if (indicators[obj._id]?.count) {
            //   api.clearIndicatorByCid({ cid: obj._id, uId: userInfo._id });
            // }
          }}
        >
          <ChatBox
            chatName={chatName}
            chatDescription={obj.description}
            timeOfLastUpdate={obj.updated_at}
            // countOfNewMessage={indicators[obj._id]?.count}
          />
        </Link>
      );
    }
    return list;
  }, [conversations, participants]);

  return (
    <aside>
      <div className="user-box">
        <div className="user-photo">
          {!userInfo ? (
            <VscDeviceCamera />
          ) : (
            userInfo?.login.slice(0, 2).toUpperCase()
          )}
        </div>
        <div className="user-info">
          <p>{userInfo?.login}</p>
        </div>
      </div>
      <div className="chat-list">
        {!Object.keys(conversations).length ? (
          <p>No one chat find...</p>
        ) : (
          chatsList
        )}
        <div className="chat-create-btn" onClick={() => setIsSearchForm(true)}>
          <VscComment />
        </div>
        {isSearchForm ? <UserSearch close={setIsSearchForm} /> : ""}
      </div>
    </aside>
  );
}
