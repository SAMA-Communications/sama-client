import AttachmentsList from "../../generic/AttachmentsList.js";
import ChatMessage from "../../generic/ChatMessage.js";
import NoChatSelected from "../../static/NoChatSelected.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import api from "../../../api/api";
import getLastVisitTime from "../../../utils/get_last_visit_time.js";
import isMobile from "../../../utils/get_device_type.js";
import jwtDecode from "jwt-decode";
import { getNetworkState } from "../../../store/NetworkState.js";
import { getFileObjects } from "../../../api/download_manager.js";
import {
  selectParticipantsEntities,
  upsertUser,
} from "../../../store/Participants.js";
import {
  clearCountOfUnreadMessages,
  getConverastionById,
  markConversationAsRead,
  removeChat,
  selectConversationsEntities,
  setLastMessageField,
  updateLastMessageField,
} from "../../../store/Conversations";
import { clearSelectedConversation } from "../../../store/SelectedConversation";
import {
  addMessage,
  getActiveConversationMessages,
  markMessagesAsRead,
  removeMessage,
} from "../../../store/Messages";
import { animateSVG } from "../../../styles/animations/animationSVG.js";
import { motion as m } from "framer-motion";
import { scaleAndRound } from "../../../styles/animations/animationBlocks.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/chat/ChatForm.css";

import { ReactComponent as EmptyChat } from "./../../../assets/icons/chatForm/EmptyChat.svg";
import { ReactComponent as BurgerMenu } from "./../../../assets/icons/chatForm/BurgerMenu.svg";
import { ReactComponent as RecipientPhoto } from "./../../../assets/icons/chatForm/RecipientPhoto.svg";
import { ReactComponent as SendFilesButton } from "./../../../assets/icons/chatForm/SendFilesButton.svg";
import { ReactComponent as SendMessageButton } from "./../../../assets/icons/chatForm/SendMessageButton.svg";
import { ReactComponent as TrashCan } from "./../../../assets/icons/chatForm/TrashCan.svg";

export default function ChatForm({
  setAsideDisplayStyle,
  setChatFormBgDisplayStyle,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const connectState = useSelector(getNetworkState);

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
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  const opponentId = useMemo(() => {
    const conv = conversations[selectedCID];
    if (!conv) {
      return null;
    }

    return conv.owner_id === userInfo._id
      ? participants[conv.opponent_id]?._id
      : participants[conv.owner_id]?._id;
  }, [selectedCID]);

  const opponentLastActivity = useMemo(
    () => participants[opponentId]?.recent_activity,
    [opponentId, participants]
  );

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
  };

  useEffect(() => {
    if (!selectedCID) {
      return;
    }

    if (conversations[selectedCID].unread_messages_count > 0) {
      dispatch(clearCountOfUnreadMessages(selectedCID));
      api.markConversationAsRead({ cid: selectedCID });
    }
    setFiles([]);
  }, [selectedCID]);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!connectState) {
      alert("No internet connection");
      return;
    }

    const text = messageInputEl.current.value.trim();
    if ((text.length === 0 && !files?.length) || isSendMessageDisable) {
      return;
    }
    setIsSendMessageDisable(true);
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

    let response;
    try {
      response = await api.messageCreate(reqData);
    } catch (err) {
      alert("There is no server connection");
      dispatch(
        setLastMessageField({
          cid: selectedCID,
          msg: messages[messages.length - 1],
        })
      );
      return;
    }

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
    setFiles([]);
    filePicker.current.value = "";
    isMobile && messageInputEl.current.blur();

    setIsSendMessageDisable(false);
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

  const [modalOpen, setModalOpen] = useState(false);

  const close = () => setModalOpen(false);
  const open = (options) => setModalOpen(options);

  const modalWindow = () => {
    window.onkeydown = function (event) {
      if (event.keyCode === 27) {
        close();
      }
    };

    return (
      <div exit="exit" className="modal-window" onClick={() => close()}>
        <img src={modalOpen?.url} alt={modalOpen?.name} />
      </div>
    );
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
          openModalParam={open}
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
      api.unsubscribeFromUserActivity({});
      navigate("/main");
    }
  };
  window.onresize = function (event) {
    if (messageInputEl.current) {
      messageInputEl.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const [reloadActivity, setReloadActivity] = useState(false);
  useEffect(() => {
    const debounce = setTimeout(() => setReloadActivity((prev) => !prev), 250);
    return () => clearTimeout(debounce);
  }, [opponentLastActivity, selectedConversation]);

  const recentActivityView = useMemo(() => {
    if (selectedConversation?.name) {
      return null;
    }

    return opponentLastActivity === "online"
      ? opponentLastActivity
      : getLastVisitTime(opponentLastActivity);
  }, [reloadActivity]);

  const pickUserFiles = () => filePicker.current.click();
  const handlerChange = (event) => {
    if (!event.target.files.length) {
      return;
    }

    if (files?.length + event.target.files.length >= 10) {
      alert("Max limit to upload files 10");
      return;
    }

    setFiles(
      files?.length
        ? [...files, ...event.target.files]
        : [...event.target.files]
    );
    messageInputEl.current.focus();
  };

  const openChatList = () => {
    setAsideDisplayStyle("block");
    setChatFormBgDisplayStyle("flex");
  };

  const chatNameView = useMemo(() => {
    if (!selectedConversation || !participants) {
      return <p></p>;
    }

    const { owner_id, opponent_id, name } = selectedConversation;
    if (name) {
      return <p>{name}</p>;
    }

    const ownerLogin = participants[owner_id]?.login;
    const opponentLogin = participants[opponent_id]?.login;

    return <p>{owner_id === userInfo._id ? opponentLogin : ownerLogin}</p>;
  }, [selectedConversation, participants]);

  return (
    <m.section
      variants={scaleAndRound(50, 0.1, 1.7, 0, 0.3)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="chat-form"
    >
      <m.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 0.7,
            transition: { delay: 0.5, duration: 1.5 },
          },
        }}
        className="chat-menu-btn"
        onClick={openChatList}
      >
        <BurgerMenu />
      </m.div>
      {!selectedCID ? (
        <NoChatSelected />
      ) : (
        <m.div
          variants={animateSVG(0, 0, 0, 0, 0.15)}
          exit="exit"
          className="chat-form-messaging"
        >
          <div className="chat-messaging-info">
            <div className="chat-info-block">
              <div className="chat-recipient-photo">
                <RecipientPhoto />
              </div>
              <div className="chat-recipient-info">
                {chatNameView}
                <div className="chat-recipient-status">
                  {recentActivityView}
                </div>
              </div>
            </div>
            <div className="chat-delete-btn" onClick={deleteChat}>
              <TrashCan />
            </div>
          </div>
          <div className="chat-form-main">
            {!messages.length ? (
              <div className="chat-empty">
                <EmptyChat />
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
              <SendFilesButton onClick={pickUserFiles} />
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
                autoFocus={!isMobile}
                ref={messageInputEl}
                onTouchStart={(e) => e.target.blur()}
                autoComplete="off"
                placeholder="> Write your message..."
              />
              <button id="send-message" onClick={sendMessage}>
                <SendMessageButton />
              </button>
            </div>
          </form>
          {modalOpen && modalWindow()}
        </m.div>
      )}
    </m.section>
  );
}
