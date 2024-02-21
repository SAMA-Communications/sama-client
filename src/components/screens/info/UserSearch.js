import React, { useEffect, useState, useTransition } from "react";
import SearchedUser from "@generic/searchComponents/SearchedUser.js";
import SelectedUser from "@generic/searchComponents/SelectedUser.js";
import api from "@api/api";
import getPrevPage from "@utils/get_prev_page.js";
import showCustomAlert from "@utils/show_alert.js";
import { addUsers } from "@store/values/Participants.js";
import {
  getConverastionById,
  insertChat,
} from "@store/values/Conversations.js";
import { getIsMobileView } from "@store/values/IsMobileView.js";
import { setSelectedConversation } from "@store/values/SelectedConversation.js";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import "@styles/pages/UserSearch.css";

import { ReactComponent as BackBtn } from "@icons/chatForm/BackBtn.svg";
import { ReactComponent as SearchIndicator } from "@icons/SearchIndicator.svg";

export default function UserSearch({ type }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const isMobileView = useSelector(getIsMobileView);

  const [searchTerm, setSearchTerm] = useState("");
  const [isPending, startTransition] = useTransition();
  const [ignoreIds, setIgnoreIds] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isUserSearched, setIsUserSearched] = useState("Search results");

  useEffect(() => {
    if (type === "create_group_chat") {
      setIgnoreIds([]);
      return;
    }

    if (!selectedConversation?.participants) {
      return;
    }

    setIgnoreIds(selectedConversation.participants);
  }, [selectedConversation, type]);

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
      const users = await api.getParticipantsByCids({ cids: [chat._id] });
      dispatch(addUsers(users));
      dispatch(insertChat({ ...chat, messagesIds: [] }));

      navigate(`/#${chat._id}`);
      dispatch(setSelectedConversation({ id: chat._id }));
    }
  };

  const addParticipants = async (event) => {
    event.preventDefault();

    if (selectedUsers.length) {
      const addUsersArr = selectedUsers.map((el) => el._id);
      const requestData = {
        cid: selectedCID,
        participants: { add: addUsersArr },
      };

      if (
        !window.confirm(
          `Add selected user${selectedUsers.length > 1 ? "s" : ""} to the chat?`
        )
      ) {
        return;
      }

      await api.conversationUpdate(requestData);
      navigate(`/#${isMobileView ? selectedCID : selectedCID + "/info"}`);
    }
  };

  const addUserToIgnore = async (data) => {
    if (
      (type === "create_group_chat"
        ? 0
        : selectedConversation?.participants.length) +
        selectedUsers.length >=
      49
    ) {
      showCustomAlert(
        "There are too many users in the group conversation.",
        "warning"
      );
      return;
    }

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
    event.keyCode === 27 && navigate(getPrevPage(pathname + hash));
    event.keyCode === 13 && event.preventDefault();
  };

  return (
    <form
      id="search-form"
      data-css={type === "create_group_chat" ? "left-side" : "right-side"}
    >
      <div className="search-options fcc">
        <div
          className="search-close-chat"
          onClick={() => navigate(getPrevPage(pathname + hash))}
        >
          <BackBtn />
        </div>
        <input
          id="inputSearchLogin"
          autoComplete="off"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Input user email (at least 2 characters)"
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
      {type === "create_group_chat" ? (
        <div className="search-create-chat" onClick={createChat}>
          <p>Create a chat</p>
        </div>
      ) : (
        <div className="search-create-chat" onClick={addParticipants}>
          <p>Add participants</p>
        </div>
      )}
    </form>
  );
}
