import React, { useEffect, useMemo, useState } from "react";
import api from "../../../api/api.js";
import jwtDecode from "jwt-decode";
import ChatBox from "../../generic/ChatBox.js";
import UserSearch from "./UserSearch.js";
import { NavLink } from "react-router-dom";
import {
  selectParticipantsEntities,
  setUsers,
} from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  selectAllConversations,
  setChats,
} from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useSelector, useDispatch } from "react-redux";
import { motion as m } from "framer-motion";

import "../../../styles/chat/ChatList.css";

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

  useEffect(() => {
    setTimeout(() => {
      api.conversationList({}).then((chats) => {
        if (!chats) {
          return;
        }
        dispatch(setChats(chats));
        api
          .getParticipantsByCids(chats.map((obj) => obj._id))
          .then((users) => dispatch(setUsers(users)));
      });
    }, 300);
    // // Function to add our give data into cache
    // const addDataIntoCache = (cacheName, url, response) => {
    //   // Converting our response into Actual Response form
    //   const data = new Response(JSON.stringify(response));

    //   if ("caches" in window) {
    //     // Opening given cache and putting our data into it
    //     caches.open(cacheName).then((cache) => {
    //       cache.put(url, data);
    //       alert("Data Added into cache!");
    //     });
    //   }
    // };
    // addDataIntoCache("MyCache", "https://localhost:300", "SampleData");
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
        animate={{
          scale: [0, 1, 1],
          borderRadius: ["40%", "50px", "20px"],
          transition: { delay: 0.1, duration: 1.7 },
          transitionEnd: { borderRadius: "var(--border-main-radius)" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        className="user-box"
      >
        <m.div
          initial={{ opacity: 0, padding: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.9, duration: 1 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="user-photo"
        >
          {!userInfo ? (
            <svg
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M48.0433 51.3333C48.0433 42.3033 39.06 35 28 35C16.94 35 7.95667 42.3033 7.95667 51.3333M28 28C31.0942 28 34.0617 26.7708 36.2496 24.5829C38.4375 22.395 39.6667 19.4275 39.6667 16.3333C39.6667 13.2391 38.4375 10.2717 36.2496 8.08375C34.0617 5.89583 31.0942 4.66666 28 4.66666C24.9058 4.66666 21.9383 5.89583 19.7504 8.08375C17.5625 10.2717 16.3333 13.2391 16.3333 16.3333C16.3333 19.4275 17.5625 22.395 19.7504 24.5829C21.9383 26.7708 24.9058 28 28 28V28Z"
                stroke="white"
              />
            </svg>
          ) : (
            userInfo?.login.slice(0, 2).toUpperCase()
          )}
        </m.div>
        <m.div
          initial={{ opacity: 0, padding: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 0.9, duration: 1 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="user-info"
        >
          <p className="user-info-name">{userInfo?.login}</p>
          {/* <p className="user-info-status"></p> */}
        </m.div>
      </m.div>
      <m.div
        initial={{}}
        animate={{
          scale: [0, 1, 1],
          borderRadius: ["50%", "100px", "20px"],
          transition: { delay: 0.1, duration: 1.7 },
          transitionEnd: { borderRadius: "var(--border-main-radius)" },
        }}
        exit={{
          opacity: 0,
          transition: { duration: 0.3 },
        }}
        className="chat-list"
      >
        {!Object.keys(conversations).length ? (
          <m.p
            initial={{ opacity: 0, padding: 0 }}
            animate={{
              opacity: 1,
              transition: { delay: 0.9, duration: 1 },
            }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="empty-list"
          >
            No one chat find...
          </m.p>
        ) : (
          chatsList
        )}
        <m.div
          initial={{ opacity: 0, marginBottom: "-10px" }}
          animate={{
            opacity: 1,
            marginBottom: 0,
            transition: { delay: 0.9, duration: 0.5 },
          }}
          exit={{ opacity: 0, transition: { delay: 0, duration: 0 } }}
          className="chat-create-btn"
          onClick={() => setIsSearchForm(true)}
        >
          <svg
            width="34"
            height="34"
            viewBox="0 0 34 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.2083 27.625H20.5417M23.375 30.4583V24.7916M16.9858 30.8975C14.4075 30.8975 11.8433 30.2458 9.88833 28.9425C6.45999 26.6475 6.45999 22.9075 9.88833 20.6266C13.7842 18.02 20.1733 18.02 24.0692 20.6266M17.2267 15.3991C17.085 15.385 16.915 15.385 16.7592 15.3991C15.1331 15.3439 13.5924 14.658 12.4633 13.4866C11.3342 12.3152 10.7054 10.7503 10.71 9.12331C10.7078 8.29786 10.8685 7.48009 11.1829 6.71686C11.4973 5.95364 11.9593 5.25998 12.5423 4.67564C13.1253 4.09129 13.8179 3.62777 14.5805 3.31162C15.343 2.99548 16.1604 2.83294 16.9858 2.83331C20.4567 2.83331 23.2758 5.65248 23.2758 9.12331C23.2758 12.5233 20.5842 15.2858 17.2267 15.3991V15.3991Z"
              stroke="var(--icon-stroke-color)"
            />
          </svg>
        </m.div>
        {isSearchForm && <UserSearch close={setIsSearchForm} />}
      </m.div>
    </aside>
  );
}
