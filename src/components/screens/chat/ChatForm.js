import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscLayersActive,
  VscNewFile,
  VscRocket,
  VscTrash,
} from "react-icons/vsc";
import ChatMessage from "../../generic/ChatMessage.js";
import AttachmentsList from "../../generic/AttachmentsList.js";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import {
  getDownloadFileLinks,
  getFileObjects,
} from "../../../api/download_manager.js";
import {
  selectParticipantsEntities,
  upsertUser,
} from "../../../store/Participants.js";
import {
  getConverastionById,
  markConversationAsRead,
  removeChat,
  selectConversationsEntities,
  updateLastMessageField,
  upsertChat,
} from "../../../store/Conversations";
import { clearSelectedConversation } from "../../../store/SelectedConversation";
import {
  addMessage,
  addMessages,
  getActiveConversationMessages,
  markMessagesAsRead,
  removeMessage,
  upsertMessages,
} from "../../../store/Messages";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion as m } from "framer-motion";

import "../../../styles/chat/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const conversations = useSelector(selectConversationsEntities);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const messages = useSelector(getActiveConversationMessages);
  const messageInputEl = useRef(null);
  const filePicker = useRef(null);
  const [files, setFiles] = useState([]);

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
    message.from === userInfo._id
      ? dispatch(addMessage({ ...message, status: "sent" }))
      : dispatch(addMessage(message));
    let countOfNewMessages = 0;
    message.cid === selectedCID
      ? api.markConversationAsRead({ cid: selectedCID })
      : (countOfNewMessages = 1);
    dispatch(
      updateLastMessageField({
        cid: message.cid,
        msg: message,
        countOfNewMessages,
      })
    );
  };

  useEffect(() => {
    if (!selectedCID) {
      return;
    }

    if (!conversations[selectedCID].activated) {
      api.messageList({ cid: selectedCID, limit: 20 }).then(async (arr) => {
        const messagesIds = arr.map((el) => el._id).reverse();
        dispatch(addMessages(arr));
        dispatch(
          upsertChat({
            _id: selectedCID,
            messagesIds,
            activated: true,
          })
        );
        const mAttachments = {};
        for (let i = 0; i < arr.length; i++) {
          const attachments = arr[i].attachments;
          if (!attachments) {
            continue;
          }
          attachments.forEach(
            (obj) =>
              (mAttachments[obj.file_id] = {
                _id: arr[i]._id,
                ...obj,
              })
          );
        }

        if (Object.keys(mAttachments).length > 0) {
          getDownloadFileLinks(mAttachments).then((msgs) =>
            dispatch(upsertMessages(msgs))
          );
        }
      });
    }

    if (conversations[selectedCID].type === "u") {
      const obj = conversations[selectedCID];
      const uId =
        obj.owner_id === userInfo._id
          ? participants[obj.opponent_id]?._id
          : participants[obj.owner_id]?._id;
      api.subscribeToUserActivity(uId).then((activity) => {
        dispatch(
          upsertUser({
            _id: uId,
            recent_activity: activity[uId],
          })
        );
      });
    }

    setFiles([]);
  }, [selectedCID]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length === 0 && !files) {
      return;
    }

    messageInputEl.current.value = "";
    const mid = userInfo._id + Date.now();
    let msg = {
      _id: mid,
      body: text,
      from: userInfo._id,
      t: Date.now(),
    };

    dispatch(addMessage(msg));
    dispatch(updateLastMessageField({ cid: selectedCID, msg }));

    let attachments = [];
    const reqData = {
      mid,
      text: text,
      chatId: selectedCID,
    };

    if (files?.length) {
      attachments = await getFileObjects(files);
      reqData["attachments"] = attachments.map((obj) => {
        return { file_id: obj.file_id, file_name: obj.file_name };
      });
    }

    const response = await api.messageCreate(reqData);
    if (response.mid) {
      msg = {
        _id: response.server_mid,
        body: text,
        from: userInfo._id,
        status: "sent",
        t: response.t,
        attachments,
      };

      dispatch(addMessage(msg));
      dispatch(
        updateLastMessageField({
          cid: selectedCID,
          resaveLastMessage: 1,
          msg,
        })
      );
      dispatch(removeMessage(mid));
    }
    setFiles(null);
  };

  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: selectedCID });
        dispatch(clearSelectedConversation());
        dispatch(removeChat(selectedCID));
        navigate("/main");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const messagesList = useMemo(() => {
    if (!messages) {
      return [];
    }
    const msgsArray = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      msgsArray.push(
        <ChatMessage
          key={msg._id}
          fromId={msg.from}
          userId={userInfo._id}
          text={msg.body}
          uName={participants[msg.from]?.login}
          isPrevMesssageYours={
            i > 0 ? messages[i - 1].from === messages[i].from : false
          }
          isNextMessageYours={
            i < messages.length - 1
              ? messages[i].from === messages[i + 1].from
              : false
          }
          attachments={msg.attachments}
          status={msg.status}
          tSend={msg.t}
        />
      );
    }
    return msgsArray;
  }, [messages]);

  const scrollChatToBottom = () => {
    document.getElementById("chat-messages")?.scrollIntoView({
      block: "end",
    });
  };
  useEffect(() => scrollChatToBottom(), [messagesList]);

  window.onkeydown = function (event) {
    if (event.keyCode === 27) {
      dispatch(clearSelectedConversation());
      navigate("/main");
    }
  };

  const recentActivityView = () => {
    if (selectedConversation.name) {
      return null;
    }

    return selectedConversation.opponent_id === userInfo._id
      ? participants[selectedConversation.owner_id].recent_activity
      : participants[selectedConversation.opponent_id].recent_activity;
  };

  const pickUserFiles = () => {
    filePicker.current.click();
  };
  const handlerChange = (event) => {
    if (!event.target.files.length) {
      return;
    }

    if (files?.length + event.target.files.length >= 10) {
      alert("Max limit to upload files 10");
      return;
    }

    setFiles([...files, ...event.target.files]);
  };

  const exitOptions = { opacity: 0, transition: { delay: 0, duration: 0.25 } };
  const iconViewOptions = { strokeDashoffset: 0, opacity: 1 };

  return (
    <m.section
      initial={{ width: 0, padding: 0 }}
      animate={{
        width: "calc(100% - 460px)",
        padding: "15px",
        transition: { delay: 0.1, duration: 1.7 },
      }}
      exit={{ width: 0, padding: 0, transition: { duration: 0.3 } }}
      className="chat-form"
    >
      {!selectedCID ? (
        <m.div
          initial={{ opacity: 0, padding: 0 }}
          animate={{
            opacity: 1,
            transition: { delay: 1.2, duration: 1 },
          }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="chat-form-loading"
        >
          <svg
            id="chat-form-loading-icon"
            width="92"
            height="92"
            viewBox="0 0 92 92"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <m.path
              initial={{
                strokeDasharray: "260px",
                strokeDashoffset: "260px",
              }}
              animate={{
                ...iconViewOptions,
                transition: { delay: 1.2, duration: 1.5 },
              }}
              exit={exitOptions}
              d="M32.5834 72.8333H30.6667C15.3334 72.8333 7.66669 69 7.66669 49.8333V30.6667C7.66669 15.3333 15.3334 7.66666 30.6667 7.66666H61.3334C76.6667 7.66666 84.3334 15.3333 84.3334 30.6667V49.8333C84.3334 65.1667 76.6667 72.8333 61.3334 72.8333H59.4167C58.2284 72.8333 57.0784 73.4083 56.35 74.3667L50.6 82.0333C48.07 85.4067 43.93 85.4067 41.4 82.0333L35.65 74.3667C35.0367 73.5233 33.6184 72.8333 32.5834 72.8333V72.8333Z"
              stroke="white"
            />
            <m.path
              exit={exitOptions}
              d="M61.318 42.1667H61.3564M45.9809 42.1667H46.0192M30.6475 42.1667H30.6782"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p>Select your chat ...</p>
        </m.div>
      ) : (
        <m.div
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          className="chat-form-messaging"
        >
          <div className="chat-messaging-info">
            <div className="chat-info-block">
              <div className="chat-recipient-photo">
                <svg
                  width="56"
                  height="56"
                  viewBox="0 0 56 56"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M38.29 9.33335C42.8167 9.33335 46.4567 12.9967 46.4567 17.5C46.4567 21.91 42.9567 25.5033 38.5933 25.6667C38.3918 25.6433 38.1882 25.6433 37.9867 25.6667M42.7933 46.6667C44.4733 46.3167 46.06 45.64 47.3667 44.6367C51.0067 41.9067 51.0067 37.4033 47.3667 34.6733C46.0833 33.6933 44.52 33.04 42.8633 32.6667M21.3733 25.3633C21.14 25.34 20.86 25.34 20.6033 25.3633C17.9252 25.2724 15.3875 24.1426 13.5278 22.2133C11.6681 20.2839 10.6324 17.7064 10.64 15.0267C10.64 9.31001 15.26 4.66668 21 4.66668C23.7446 4.61717 26.3964 5.65996 28.3721 7.56564C30.3478 9.47132 31.4855 12.0838 31.535 14.8283C31.5845 17.5729 30.5417 20.2247 28.636 22.2004C26.7304 24.1761 24.1179 25.3138 21.3733 25.3633ZM9.70668 33.9733C4.06001 37.7533 4.06001 43.9134 9.70668 47.67C16.1233 51.9634 26.6467 51.9634 33.0633 47.67C38.71 43.89 38.71 37.73 33.0633 33.9733C26.67 29.7033 16.1467 29.7033 9.70668 33.9733V33.9733Z"
                    stroke="white"
                  />
                </svg>
              </div>
              <div className="chat-recipient-info">
                <p>
                  {selectedConversation.name
                    ? selectedConversation.name
                    : url.hash?.slice(1)}
                </p>
                <div className="chat-recipient-status">
                  {recentActivityView()}
                </div>
              </div>
            </div>
            <div className="chat-delete-btn" onClick={deleteChat}>
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M31.5 8.97C26.505 8.475 21.48 8.22 16.47 8.22C13.5 8.22 10.53 8.37 7.56 8.67L4.5 8.97M12.75 7.455L13.08 5.49C13.32 4.065 13.5 3 16.035 3H19.965C22.5 3 22.695 4.125 22.92 5.505L23.25 7.455M28.275 13.71L27.3 28.815C27.135 31.17 27 33 22.815 33H13.185C9 33 8.865 31.17 8.7 28.815L7.725 13.71M15.495 24.75H20.49M14.25 18.75H21.75"
                  stroke="white"
                />
              </svg>
            </div>
          </div>
          <div className="chat-form-main">
            {!messages.length ? (
              <div className="chat-empty">
                <svg
                  width="68"
                  height="68"
                  viewBox="0 0 68 68"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M37.5699 10.2L14.3082 34.8217C13.4299 35.7567 12.5799 37.5984 12.4099 38.8734L11.3616 48.0534C10.9932 51.3684 13.3732 53.635 16.6599 53.0684L25.7832 51.51C27.0582 51.2834 28.8432 50.3484 29.7216 49.385L52.9832 24.7634C57.0066 20.5134 58.8199 15.6684 52.5582 9.74669C46.3249 3.88169 41.5932 5.95002 37.5699 10.2V10.2Z"
                    stroke="white"
                  />
                  <path
                    d="M33.6883 14.3083C34.2823 18.1074 36.121 21.6017 38.9159 24.2427C41.7107 26.8837 45.3034 28.5218 49.13 28.9M8.5 62.3334H59.5"
                    stroke="white"
                  />
                </svg>
                <p>Write your message...</p>
              </div>
            ) : (
              <div className="chat-messages" id="chat-messages">
                {messagesList}
              </div>
            )}
          </div>
          {files?.length ? (
            <AttachmentsList files={files} funcUpdateFile={setFiles} />
          ) : null}
          <form id="chat-form-send" action="">
            <div className="form-send-file">
              <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={pickUserFiles}
              >
                <path
                  d="M20.55 20.25L16.4334 24.3667C15.8906 24.9078 15.46 25.5507 15.1662 26.2585C14.8724 26.9664 14.7212 27.7253 14.7212 28.4917C14.7212 29.2581 14.8724 30.0169 15.1662 30.7248C15.46 31.4326 15.8906 32.0755 16.4334 32.6167C16.9745 33.1594 17.6174 33.59 18.3253 33.8838C19.0331 34.1776 19.792 34.3289 20.5584 34.3289C21.3248 34.3289 22.0837 34.1776 22.7915 33.8838C23.4993 33.59 24.1423 33.1594 24.6834 32.6167L31.1667 26.1333C33.352 23.9439 34.5794 20.9768 34.5794 17.8833C34.5794 14.7899 33.352 11.8228 31.1667 9.63333C28.9772 7.448 26.0102 6.22064 22.9167 6.22064C19.8233 6.22064 16.8562 7.448 14.6667 9.63333L7.60005 16.7C3.70005 20.6 3.70005 26.9333 7.60005 30.85"
                  stroke="white"
                />
              </svg>
              <input
                id="inputFile"
                ref={filePicker}
                onChange={handlerChange}
                type="file"
                accept="image/*"
                multiple
              />
            </div>
            <div className="form-send-text">
              <input
                id="inputMessage"
                ref={messageInputEl}
                autoComplete="off"
                placeholder="> Write your message..."
              />
              <button id="send-message" onClick={sendMessage}>
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 30 30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M24.1124 11.4625L9.62494 3.8375C6.18744 2.025 2.44994 5.6875 4.18744 9.1625L6.21244 13.2125C6.77494 14.3375 6.77494 15.6625 6.21244 16.7875L4.18744 20.8375C2.44994 24.3125 6.18744 27.9625 9.62494 26.1625L24.1124 18.5375C26.9624 17.0375 26.9624 12.9625 24.1124 11.4625Z"
                    stroke="white"
                  />
                </svg>
              </button>
            </div>
          </form>
        </m.div>
      )}
    </m.section>
  );
}
