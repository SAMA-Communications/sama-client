import React, { useRef, useState } from "react";
import { VscClose, VscSearch } from "react-icons/vsc";
import api from "../../api/api";

import "../../styles/UserSearch.css";

export default function UserSearch({ close }) {
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
        <div className="chat-selected-users">
          {selectedUsers.length
            ? selectedUsers.map((d) => (
                <div
                  key={d._id + "-selected"}
                  className={"list-user-selected-box"}
                  onClick={() => removeUserToIgnore(d)}
                >
                  <p>{d.login}</p>
                  <span>
                    <VscClose />
                  </span>
                </div>
              ))
            : ""}
        </div>
        <div className="list-users">
          {listUsers.length ? (
            listUsers.map((d) => (
              <div
                key={d._id}
                className={"list-user-box"}
                onClick={() => addUserToIgnore(d)}
              >
                <p>User: {d.login}</p>
              </div>
            ))
          ) : (
            <div className="list-user-message">Users not found</div>
          )}
        </div>
        <div className="search-create-chat">
          <button>Create chat</button>
        </div>
      </form>
      <div className="close-form-btn" onClick={() => close(false)}>
        <VscClose />
      </div>
    </div>
  );
}
