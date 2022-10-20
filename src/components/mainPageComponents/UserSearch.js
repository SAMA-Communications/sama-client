import React, { useRef, useState } from "react";
import { VscClose, VscSearch } from "react-icons/vsc";
import api from "../../api/api";

import "../../styles/UserSearch.css";

export default function UserSearch({ close }) {
  const inputSearchLogin = useRef(null);
  const [listUsers, setListUsers] = useState([]);

  const sendSearchRequest = async (event) => {
    event.preventDefault();

    const login = inputSearchLogin.current.value.trim();
    if (login.length > 1) {
      const requestData = {
        login: login,
        //   limit: 10,
        //   updated_at: undefined,
      };
      const users = await api.userSearch(requestData);
      if (users) setListUsers(users);
    }
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
        <div className="list-users">
          {listUsers.length ? (
            listUsers.map((d) => (
              <div key={d._id} className={"list-user-box"}>
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
