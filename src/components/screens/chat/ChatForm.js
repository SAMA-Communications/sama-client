import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  VscDeviceCamera,
  VscFileSymlinkDirectory,
  VscRocket,
  VscTrash,
} from "react-icons/vsc";
import ChatMessage from "../../generic/ChatMessage.js";
import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import { selectParticipantsEntities } from "../../../store/Participants.js";
import {
  removeChat,
  selectConversationsEntities,
  upsertChat,
} from "../../../store/Conversations";
import { setSelectedConversation } from "../../../store/SelectedConversation";
import {
  addMessage,
  addMessages,
  selectMessagesEntities,
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

  const selectedConversation = useSelector(
    (state) => state.selectedConversation.value
  );
  const participants = useSelector(selectParticipantsEntities);

  const messageInputEl = useRef(null);
  const messages = useSelector(selectMessagesEntities);
  const conversations = useSelector(selectConversationsEntities);

  useEffect(() => {
    if (
      selectedConversation._id &&
      !conversations[selectedConversation._id].messagesIds.length
    )
      api
        .messageList({ cid: selectedConversation._id, limit: 20 })
        .then((arr) => {
          dispatch(
            addMessages(
              arr.map((m) => {
                return { ...m, status: "sent" };
              })
            )
          );

          dispatch(
            upsertChat({
              _id: selectedConversation._id,
              messagesIds: arr.map((el) => el._id).reverse(),
            })
          );
        });
  }, [url]);

  const [newMessage, setNewMessage] = useState(null);
  api.onMessageListener = (message) => {
    setNewMessage(message);
  };

  useEffect(() => {
    if (newMessage) {
      dispatch(addMessage(newMessage));
      dispatch(
        upsertChat({
          _id: selectedConversation._id,
          messagesIds: [
            ...conversations[selectedConversation._id].messagesIds,
            newMessage._id,
          ],
        })
      );
    }
  }, [newMessage]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length === 0) return;

    const mid = userInfo._id + Date.now();
    let msg = {
      _id: mid,
      body: text,
      from: userInfo._id,
      t: Date.now(),
    };
    messageInputEl.current.value = "";
    dispatch(addMessage(msg));
    dispatch(
      upsertChat({
        _id: selectedConversation._id,
        messagesIds: [
          ...conversations[selectedConversation._id].messagesIds,
          msg._id,
        ],
      })
    );
    const response = await api.messageCreate({
      mid,
      text,
      chatId: selectedConversation._id,
    });

    if (response.mid) {
      msg = {
        _id: response.server_mid,
        body: text,
        from: userInfo._id,
        status: "sent",
        t: response.t,
      };
      dispatch(addMessage(msg));
      dispatch(
        upsertChat({
          _id: selectedConversation._id,
          messagesIds: [
            ...conversations[selectedConversation._id].messagesIds,
            msg._id,
          ],
        })
      );
    }
  };

  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: selectedConversation._id });
        dispatch(setSelectedConversation({}));
        dispatch(removeChat(selectedConversation._id));
        navigate("/main");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  window.onkeydown = function (event) {
    if (event.keyCode === 27) {
      dispatch(setSelectedConversation({}));
      navigate("/main");
    }
  };

  const messagesList = useMemo(() => {
    const messagesIds = conversations[selectedConversation._id]?.messagesIds;
    if (!Object.keys(messages).length || !messagesIds.length) return [];
    return messagesIds.map((id) => {
      const m = messages[id];
      return m ? (
        <ChatMessage
          key={m._id}
          fromId={m.from}
          userId={userInfo._id}
          text={m.body}
          uName={participants[m.from]?.login}
          status={m.status}
        />
      ) : null;
    });
  }, [url, messages]);

  const scrollChatToBottom = () => {
    document.getElementById("chat-messages")?.scrollIntoView({
      block: "end",
    });
  };
  useEffect(() => {
    scrollChatToBottom();
  }, [messagesList]);

  return (
    <section className="chat-form">
      {!selectedConversation._id ? (
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
              <p>{selectedConversation.name}</p>
              <div className="chat-recipient-status hide">
                <span>|</span>
                <p>typing...</p>
              </div>
            </div>
            <div className="chat-delete-btn" onClick={deleteChat}>
              <VscTrash />
            </div>
          </div>
          <div className="chat-form-main">
            {!conversations[selectedConversation._id]?.messagesIds.length ? (
              <div className="chat-empty">Chat is empty..</div>
            ) : (
              <div className="chat-messages" id="chat-messages">
                {messagesList}
              </div>
            )}
          </div>
          <form id="chat-form-send" action="">
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
