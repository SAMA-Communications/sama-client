import React, { useRef, useState } from "react";
import SearchedUser from "../../generic/SearchedUser.js";
import SelectedUser from "../../generic/SelectedUser.js";
import api from "../../../api/api";
import { VscClose, VscSearch } from "react-icons/vsc";
import { upsertChat } from "../../../store/Conversations.js";
import { useDispatch } from "react-redux";

import "../../../styles/mainPageComponents/UserSearch.css";

export default function UserSearch({ close }) {
  const dispatch = useDispatch();
  const inputSearchLogin = useRef(null);
  const [ignoreIds, setIgnoreIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const sendSearchRequest = async (event) => {
    event.preventDefault();

    const login = inputSearchLogin.current.value.trim();
    if (login.length > 1) {
      const requestData = {
        login: login,
        //   limit: 10,
        //   updated_at: undefined,
        ignore_ids: ignoreIds,
      };
      const users = await api.userSearch(requestData);
      if (users) setSearchedUsers(users);
    }
  };

  const createChat = async (event) => {
    event.preventDefault();

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
    dispatch(upsertChat(chat));
    close(false);
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

  return (
    <div className="search-bg">
      <form id="search-form">
        <div className="search-options">
          <input
            id="inputSearchLogin"
            ref={inputSearchLogin}
            autoComplete="off"
            placeholder="Input user login.. (2+ charactes)"
          />
          <button onClick={sendSearchRequest}>
            <VscSearch />
          </button>
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
            : ""}
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
            <div className="list-user-message">Users not found</div>
          )}
        </div>
        <div className="search-create-chat">
          <button onClick={createChat}>Create chat</button>
        </div>
      </form>
      <div className="close-form-btn" onClick={() => close(false)}>
        <VscClose />
      </div>
    </div>
  );
}
