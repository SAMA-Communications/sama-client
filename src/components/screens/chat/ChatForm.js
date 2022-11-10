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
import {
  selectUnreadMessagesEntities,
  upsertIndicator,
} from "../../../store/UnreadMessages.js";

export default function ChatForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const url = useLocation();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const conversations = useSelector(selectConversationsEntities);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(
    (state) => state.selectedConversation.value
  );
  const indicators = useSelector(selectUnreadMessagesEntities);
  const selectedCID = selectedConversation._id;
  const selectedMIDs = conversations[selectedCID]
    ? conversations[selectedCID].messagesIds
    : [];

  const messageInputEl = useRef(null);
  const messages = useSelector(selectMessagesEntities);
  const [newMessage, setNewMessage] = useState(null);
  api.onMessageListener = (message) => {
    setNewMessage(message);
  };

  useEffect(() => {
    if (selectedCID && !selectedMIDs.length) {
      api.messageList({ cid: selectedCID, limit: 20 }).then((arr) => {
        dispatch(
          addMessages(
            arr.map((m) => {
              return { ...m, status: "sent" };
            })
          )
        );
        dispatch(
          upsertChat({
            _id: selectedCID,
            messagesIds: arr.map((el) => el._id).reverse(),
          })
        );
      });
    }

    if (newMessage) {
      dispatch(addMessage(newMessage));
      const chatMessages = conversations[newMessage.cid]
        ? conversations[newMessage.cid].messagesIds
        : [];
      if (chatMessages.length) {
        dispatch(
          upsertChat({
            _id: newMessage.cid,
            messagesIds: [...chatMessages, newMessage._id],
            updated_at: new Date(newMessage.t * 1000),
          })
        );
      }
      dispatch(
        upsertIndicator({
          cid: newMessage.cid,
          count: indicators[newMessage.cid]?.count + 1,
        })
      );
      setNewMessage(null);
    }
  }, [url, newMessage]);

  const sendMessage = async (event) => {
    event.preventDefault();

    const text = messageInputEl.current.value.trim();
    if (text.length === 0) {
      return;
    }

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
        _id: selectedCID,
        messagesIds: [...selectedMIDs, msg._id],
      })
    );
    const response = await api.messageCreate({
      mid,
      text,
      chatId: selectedCID,
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
          _id: selectedCID,
          messagesIds: [...selectedMIDs, msg._id],
          updated_at: new Date(response.t * 1000),
        })
      );
    }
  };

  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: selectedCID });
        dispatch(setSelectedConversation({}));
        dispatch(removeChat(selectedCID));
        navigate("/main");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  const messagesList = useMemo(() => {
    const messagesIds = selectedMIDs;
    if (!Object.keys(messages)?.length || !messagesIds?.length) {
      return [];
    }

    return messagesIds.map((id) => (
      <ChatMessage
        key={messages[id]._id}
        fromId={messages[id].from}
        userId={userInfo._id}
        text={messages[id].body}
        uName={participants[messages[id].from]?.login}
        status={messages[id].status}
        tSend={messages[id].t}
      />
    ));
  }, [url, messages]);

  const scrollChatToBottom = () => {
    document.getElementById("chat-messages")?.scrollIntoView({
      block: "end",
    });
  };
  useEffect(() => scrollChatToBottom(), [messagesList]);

  window.onkeydown = function (event) {
    if (event.keyCode === 27) {
      dispatch(setSelectedConversation({}));
      navigate("/main");
    }
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
            {!selectedMIDs.length ? (
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
