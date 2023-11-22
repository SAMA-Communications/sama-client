import ChatFormMain from "./chatFormBlocks/ChatFormMain.js";
import ChatFormInfo from "./chatFormBlocks/ChatFormInfo.js";
import ChatFormInputs from "./chatFormBlocks/ChatFormInputs.js";
import NoChatSelected from "../../static/NoChatSelected.js";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import { getUserIsLoggedIn } from "../../../store/UserIsLoggedIn .js";
import { addUser, upsertUser } from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  markConversationAsRead,
  selectConversationsEntities,
  updateLastMessageField,
  upsertChat,
} from "../../../store/Conversations";
import {
  clearSelectedConversation,
  setSelectedConversation,
} from "../../../store/SelectedConversation";
import { addMessage, markMessagesAsRead } from "../../../store/Messages";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import "../../../styles/pages/chat/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isUserLogin = useSelector(getUserIsLoggedIn);

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const chatMessagesBlock = useRef();
  const messageInputEl = useRef(null);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const { hash } = location;

    if (!hash || hash.split("/")[0].slice(1) === selectedCID || !isUserLogin) {
      return;
    }

    dispatch(setSelectedConversation({ id: hash.slice(1).split("/")[0] }));
  }, [location, isUserLogin]);

  useLayoutEffect(() => {
    if (!selectedCID) {
      return;
    }

    if (conversations[selectedCID].unread_messages_count > 0) {
      dispatch(clearCountOfUnreadMessages(selectedCID));
      api.markConversationAsRead({ cid: selectedCID });
    }

    files.length && setFiles([]);
  }, [selectedCID, conversations[selectedCID]]);

  api.onMessageStatusListener = (message) => {
    dispatch(markMessagesAsRead(message.ids));
    dispatch(
      markConversationAsRead({
        cid: message.cid,
        mid: Array.isArray(message.ids) ? message.ids[0] : message.ids,
      })
    );
  };

  api.onUserActivityListener = (user) => {
    const uId = Object.keys(user)[0];
    dispatch(upsertUser({ _id: uId, recent_activity: user[uId] }));
  };

  api.onMessageListener = async (message) => {
    const attachments = message.attachments;
    if (attachments) {
      const urls = await api.getDownloadUrlForFiles({
        file_ids: attachments.map((obj) => obj.file_id),
      });
      message.attachments = attachments.map((obj) => {
        return { ...obj, file_url: urls[obj.file_id] };
      });
    }
    message.from === userInfo._id && (message["status"] = "sent");
    dispatch(addMessage(message));

    let countOfNewMessages = 0;
    message.cid === selectedCID
      ? api.markConversationAsRead({ cid: selectedCID })
      : (countOfNewMessages = message.from === userInfo._id ? 0 : 1);
    dispatch(
      updateLastMessageField({
        cid: message.cid,
        msg: message,
        countOfNewMessages,
      })
    );

    const conv = conversations[selectedCID];
    if (message.x?.type === "added_participant" && conv) {
      const user = message.x.user;
      dispatch(addUser(user));
      dispatch(
        upsertChat({
          _id: selectedCID,
          participants: [...conv.participants, user._id],
        })
      );
    }
    if (message.x?.type === "removed_participant" && conv) {
      const user = message.x.user;
      dispatch(
        upsertChat({
          _id: selectedCID,
          participants: conv.participant.filter((uId) => uId !== user._id),
        })
      );
    }
  };

  const closeForm = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    dispatch(clearSelectedConversation());
    api.unsubscribeFromUserActivity({});
    navigate("/main");
  };

  document.addEventListener("swiped-left", closeForm);
  document.addEventListener("swiped-right", closeForm);
  window.onkeydown = function (event) {
    event.keyCode === 27 && closeForm();
  };
  window.onresize = function (event) {
    if (messageInputEl.current) {
      messageInputEl.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const [modalOpen, setModalOpen] = useState(false);
  const close = () => setModalOpen(false);
  const open = (options) => setModalOpen(options);

  const modalWindow = () => {
    window.onkeydown = function (event) {
      event.keyCode === 27 && close();
    };

    return (
      <div exit="exit" className="modal-window" onClick={() => close()}>
        <img src={modalOpen?.url} alt={modalOpen?.name} />
      </div>
    );
  };

  if (!selectedCID) {
    return (
      <section className="chat-form">
        <NoChatSelected />
      </section>
    );
  }

  return (
    <section className="chat-form">
      <ChatFormInfo closeForm={closeForm} />
      <ChatFormMain scrollRef={chatMessagesBlock} open={open} />
      <ChatFormInputs
        chatMessagesBlockRef={chatMessagesBlock}
        messageInputEl={messageInputEl}
        files={files}
        setFiles={setFiles}
      />
      {modalOpen && modalWindow()}
    </section>
  );
}
