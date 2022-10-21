import React, { useRef, useState } from "react";
import SelectedUser from "../generic/SelectedUser.js";
import SearchedUser from "../generic/SearchedUser.js";
import api from "../../api/api";
import { VscClose, VscSearch } from "react-icons/vsc";

import "../../styles/mainPageComponents/UserSearch.css";

export default function UserSearch({ close, setList }) {
  const inputSearchLogin = useRef(null);
  const [ignoreIds, setIgnoreIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [listUsers, setListUsers] = useState([]);

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
      if (users) setListUsers(users);
    }
  };

  const createChat = async (event) => {
    event.preventDefault();

    const chatName = window.prompt("Enter chat name:");
    const requestData = {
      name: chatName,
      desciprion: "chat",
      type: selectedUsers.length > 1 ? "g" : "u", //fix it in future
      recipient: selectedUsers.length === 1 ? selectedUsers[0]._id : undefined,
      participants: selectedUsers.map((el) => el._id),
    };
    console.log(requestData);
    const chat = await api.conversationCreate(requestData);
    setList(JSON.parse(chat));
    close(false);
  };

  const addUserToIgnore = async (data) => {
    setSelectedUsers([...selectedUsers, data]);
    setIgnoreIds([...ignoreIds, data._id]);
    setListUsers(listUsers.filter((el) => el._id !== data._id));
  };
  const removeUserToIgnore = async (data) => {
    setSelectedUsers(selectedUsers.filter((el) => el._id !== data._id));
    setIgnoreIds(ignoreIds.filter((id) => id !== data._id));
    setListUsers([...listUsers, data]);
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
        <SelectedUser removeEl={removeUserToIgnore} list={selectedUsers} />
        <SearchedUser addEl={addUserToIgnore} list={listUsers} />
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
