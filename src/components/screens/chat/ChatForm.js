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
  const [files, setFiles] = useState(null);

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

    if (files) {
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
    return messages.map((msg) => (
      <ChatMessage
        key={msg._id}
        fromId={msg.from}
        userId={userInfo._id}
        text={msg.body}
        uName={participants[msg.from]?.login}
        attachments={msg.attachments}
        status={msg.status}
        tSend={msg.t}
      />
    ));
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
    setFiles(event.target.files);
  };

  return (
    <section className="chat-form">
      {!selectedCID ? (
        <div className="chat-form-loading">
          <VscFileSymlinkDirectory />
          <p>Select your chat ...</p>
        </div>
      ) : (
        <div className="chat-form-messaging">
          <div className="chat-messaging-info">
            <div className="chat-recipient-photo">
              <VscDeviceCamera />
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
            <div className="chat-delete-btn" onClick={deleteChat}>
              <VscTrash />
            </div>
          </div>
          <div className="chat-form-main">
            {!messages.length ? (
              <div className="chat-empty">Chat is empty..</div>
            ) : (
              <div className="chat-messages" id="chat-messages">
                {messagesList}
              </div>
            )}
          </div>
          {files ? <AttachmentsList files={files} /> : null}
          <form id="chat-form-send" action="">
            {!files ? (
              <div className="form-send-file">
                <VscNewFile onClick={pickUserFiles} />
                <input
                  id="inputFile"
                  ref={filePicker}
                  onChange={handlerChange}
                  type="file"
                  accept="image/*"
                  multiple
                />
              </div>
            ) : (
              <div className="form-send-file">
                <VscLayersActive />
              </div>
            )}
            <input
              id="inputMessage"
              ref={messageInputEl}
              autoComplete="off"
              placeholder="> Write your message..."
            />
            <button onClick={sendMessage}>
              <p>Send</p>
              <VscRocket />
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
