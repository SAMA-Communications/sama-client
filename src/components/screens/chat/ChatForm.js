import React, { useEffect, useMemo, useRef } from "react";
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
  upsertMessage,
  addMessages,
  getActiveConversationMessages,
  getSelectedConversation
} from "../../../store/Messages";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "../../../styles/chat/ChatForm.css";

export default function ChatForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const conversations = useSelector(selectConversationsEntities);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getSelectedConversation);
  const messages = useSelector(getActiveConversationMessages);

  const selectedCID = selectedConversation._id;

  const messageInputEl = useRef(null);

  api.onMessageListener = (message) => {
    dispatch(addMessage(message));

    const chatMessagesIds = conversations[message.cid]
      ? conversations[message.cid].messagesIds
      : [];
    dispatch(
      upsertChat({
        _id: message.cid,
        messagesIds: [...chatMessagesIds, message._id],
        updated_at: new Date(message.t * 1000),
      })
    );
  };

  useEffect(() => {
    if (selectedCID && !messages.length) {
      api.messageList({ cid: selectedCID, limit: 20 }).then((arr) => {
        const messagesIds = arr.map((el) => el._id).reverse();
        dispatch(
          upsertChat({
            _id: selectedCID,
            messagesIds,
          })
        );
        // TODO: implement it in a better way
        dispatch(setSelectedConversation({ ...conversations[selectedCID], messagesIds }));
        dispatch(
          addMessages(
            arr.map((m) => {
              return { ...m, status: "sent" };
            })
          )
        );
      });
    }
  }, [selectedCID]);

  const messagesIds = useMemo(() => {
   return messages ? messages.map(m => m._id) : [];
  }, [messages]);

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

    const updatedMessagesIds = [...messagesIds, msg._id];
    dispatch(
      upsertChat({
        _id: selectedCID,
        messagesIds: updatedMessagesIds,
      })
    );
    // TODO: implement it in a better way
    dispatch(setSelectedConversation({ ...conversations[selectedCID], messagesIds: updatedMessagesIds }));

    const response = await api.messageCreate({
      mid,
      text,
      chatId: selectedCID,
    });

  //   if (response.mid) {
  //     msg = {
  //       _id: response.server_mid,
  //       status: "sent",
  //       t: response.t,
  //     };
  //     dispatch(upsertMessage(msg));
  //     dispatch(
  //       upsertChat({
  //         _id: selectedCID,
  //         messagesIds: [...messagesIds, msg._id],
  //         updated_at: (new Date(response.t * 1000)).toISOString(),
  //       })
  //     );
  //   }
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
    if (!messages) {
      return [];
    }
    return messages.map(msg => (
      <ChatMessage
        key={msg._id}
        fromId={msg.from}
        userId={userInfo._id}
        text={msg.body}
        uName={participants[msg.from]?.login}
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
            {!messages.length ? (
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
