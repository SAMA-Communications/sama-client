import React, { useEffect, useState, useTransition } from "react";
import SearchedUser from "../../generic/SearchedUser.js";
import SelectedUser from "../../generic/SelectedUser.js";
import api from "../../../api/api";
import { addUsers } from "../../../store/Participants.js";
import { history } from "../../../_helpers/history.js";
import { insertChat } from "../../../store/Conversations.js";
import { setSelectedConversation } from "../../../store/SelectedConversation.js";
import { useDispatch } from "react-redux";

import "../../../styles/chat/UserSearch.css";

import { ReactComponent as SearchIndicator } from "./../../../assets/icons/SearchIndicator.svg";

export default function UserSearch({ close }) {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [ignoreIds, setIgnoreIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isUserSearched, setIsUserSearched] = useState("Search results");

  useEffect(() => {
    const debounce = setTimeout(() => sendSearchRequest(searchTerm), 300);
    return () => clearTimeout(debounce);
  }, [searchTerm, ignoreIds]);

  const createChat = async (event) => {
    event.preventDefault();

    if (selectedUsers.length) {
      const requestData = {
        type: selectedUsers.length > 1 ? "g" : "u", //fix it in future
        participants: selectedUsers.map((el) => el._id),
      };
      selectedUsers.length > 1 &&
        (requestData["name"] = window.prompt("Please enter a chat name."));

      const chat = await api.conversationCreate(requestData);
      const users = await api.getParticipantsByCids([chat._id]);
      dispatch(addUsers(users));
      dispatch(insertChat({ ...chat, messagesIds: [] }));

      history.navigate(`/main/#${chat._id}`);
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

  const sendSearchRequest = async (login) => {
    startTransition(async () => {
      if (login.length > 1) {
        const requestData = {
          login: login,
          //   limit: 10,
          ignore_ids: ignoreIds,
        };

        const users = await api.userSearch(requestData);
        setSearchedUsers(users);

        if (isUserSearched === "Search results") {
          setIsUserSearched("We couldn't find the specified user.");
        }
      }
    });
  };

  window.onkeydown = function (event) {
    event.keyCode === 27 && close(false);
    event.keyCode === 13 && event.preventDefault();
  };

  return (
    <div className="search-bg">
      <form id="search-form">
        <div className="search-options">
          <input
            id="inputSearchLogin"
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Input user email (must be at least 2 characters)"
            autoFocus
          />
          {isPending && (
            <span className="search-indicator">
              <SearchIndicator />
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
          {searchedUsers.length ? (
            searchedUsers.map((d) => (
              <SearchedUser
                key={d._id}
                onClick={() => addUserToIgnore(d)}
                uLogin={d.login}
              />
            ))
          ) : (
            <div className="list-user-message">{isUserSearched}</div>
          )}
        </div>
        <div className="search-buttons">
          <div className="search-create-chat" onClick={createChat}>
            <p>Create a chat</p>
          </div>
          <div className="search-close-chat" onClick={() => close(false)}>
            <p>X</p>
          </div>
        </div>
      </form>
    </div>
  );
}
