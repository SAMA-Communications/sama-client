import React, { useEffect, useState, useTransition } from "react";
import SearchedUser from "../../generic/SearchedUser.js";
import SelectedUser from "../../generic/SelectedUser.js";
import api from "../../../api/api";
import { upsertChat } from "../../../store/Conversations.js";
import { useDispatch, useSelector } from "react-redux";
import {
  addUsers,
  selectParticipantsEntities,
} from "../../../store/Participants.js";
import { useNavigate } from "react-router-dom";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { motion as m } from "framer-motion";

import "../../../styles/chat/UserSearch.css";

export default function UserSearch({ close }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const participants = useSelector(selectParticipantsEntities);
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [ignoreIds, setIgnoreIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState(null);

  useEffect(() => {
    const debounce = setTimeout(() => sendSearchRequest(searchTerm), 400);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const createChat = async (event) => {
    event.preventDefault();

    if (selectedUsers.length) {
      const requestData = {
        name:
          selectedUsers.length === 1
            ? undefined
            : window.prompt("Enter chat name:"),
        desciprion: "chat",
        type: selectedUsers.length > 1 ? "g" : "u", //fix it in future
        opponent_id:
          selectedUsers.length === 1 ? selectedUsers[0]._id : undefined,
        participants: selectedUsers.map((el) => el._id),
      };
      const chat = await api.conversationCreate(requestData);
      dispatch(addUsers(selectedUsers));
      dispatch(upsertChat({ ...chat, messagesIds: [] }));

      navigate(
        `/main/#${chat.name ? chat._id : participants[chat.opponent_id]?.login}`
      );
      dispatch(setSelectedConversation({ id: chat._id }));

      close(false);
    }
  };

  const addUserToIgnore = async (data) => {
    setSelectedUsers([...selectedUsers, data]);
    setIgnoreIds([...ignoreIds, data._id]);
    setSearchedUsers(searchedUsers.filter((el) => el._id !== data._id));
  };
  const removeUserToIgnore = async (data) => {
    setSelectedUsers(selectedUsers.filter((el) => el._id !== data._id));
    setIgnoreIds(ignoreIds.filter((id) => id !== data._id));
    setSearchedUsers([...searchedUsers, data]);
  };

  const sendSearchRequest = (login) => {
    startTransition(async () => {
      if (login.length > 1) {
        const requestData = {
          login: login,
          //   limit: 10,
          //   updated_at: undefined,
          ignore_ids: ignoreIds,
        };
        const users = await api.userSearch(requestData);
        if (users.length) {
          setSearchedUsers(
            users.map((d) => (
              <SearchedUser
                key={d._id}
                onClick={() => addUserToIgnore(d)}
                uLogin={d.login}
              />
            ))
          );
        } else {
          setSearchedUsers(
            <div className="list-user-message">User not found</div>
          );
        }
      }
    });
  };

  window.onkeydown = function (event) {
    if (event.keyCode === 27) {
      close(false);
    }
  };

  return (
    <m.div
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: 1,
        transition: { delay: 0, duration: 0.3 },
      }}
      className="search-bg"
    >
      <form id="search-form">
        <div className="search-options">
          <input
            id="inputSearchLogin"
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Input user login.. (2+ charactes)"
            autoFocus
          />
          {isPending && (
            <span className="search-indicator">
              <svg
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.8334 23.8333L21.6667 21.6666M12.4584 22.75C13.8099 22.75 15.1482 22.4838 16.3969 21.9666C17.6455 21.4493 18.7801 20.6913 19.7357 19.7356C20.6914 18.7799 21.4495 17.6454 21.9667 16.3967C22.4839 15.1481 22.7501 13.8098 22.7501 12.4583C22.7501 11.1068 22.4839 9.76848 21.9667 8.51984C21.4495 7.2712 20.6914 6.13665 19.7357 5.18099C18.7801 4.22532 17.6455 3.46724 16.3969 2.95003C15.1482 2.43283 13.8099 2.16663 12.4584 2.16663C9.72889 2.16663 7.11117 3.25092 5.18111 5.18099C3.25105 7.11105 2.16675 9.72877 2.16675 12.4583C2.16675 15.1878 3.25105 17.8055 5.18111 19.7356C7.11117 21.6657 9.72889 22.75 12.4584 22.75V22.75Z"
                  stroke="white"
                />
              </svg>
            </span>
          )}
        </div>
        <div className="chat-selected-users">
          {selectedUsers.length
            ? selectedUsers.map((d) => (
                <SelectedUser
                  key={d._id + "-selected"}
                  onClick={() => removeUserToIgnore(d)}
                  uLogin={d.login}
                />
              ))
            : null}
        </div>
        <div className="list-users">
          {searchedUsers ? (
            searchedUsers
          ) : (
            <div className="list-user-message">Search results</div>
          )}
        </div>
        <div className="search-buttons">
          <div className="search-create-chat" onClick={createChat}>
            <p>Create chat</p>
          </div>
          <div className="search-close-chat" onClick={() => close(false)}>
            <p>X</p>
          </div>
        </div>
      </form>
    </m.div>
  );
}
