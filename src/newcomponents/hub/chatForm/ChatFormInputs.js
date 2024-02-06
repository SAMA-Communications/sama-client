import api from "@api/api";
import globalConstants from "@helpers/constants.js";
import isMobile from "@utils/get_device_type.js";
import jwtDecode from "jwt-decode";
import showCustomAlert from "@utils/show_alert";
import {
  addMessage,
  getActiveConversationMessages,
  removeMessage,
} from "@store/values/Messages";
import {
  getConverastionById,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { getNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import "@newstyles/hub/chatForm/ChatFormInputs.css";

import { ReactComponent as Attach } from "@newicons/options/Attach.svg";
import { ReactComponent as Send } from "@newicons/options/Send.svg";

export default function ChatFormInputs({
  chatMessagesBlockRef,
  messageInputEl,
}) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const messages = useSelector(getActiveConversationMessages);
  const filePicker = useRef(null);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  const scrollChatToBottom = () =>
    chatMessagesBlockRef.current?._infScroll?.scrollIntoView({ block: "end" });

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!connectState) {
      showCustomAlert("No internet connection…", "warning");
      return;
    }

    const text = messageInputEl.current.value.trim();
    if (text.length === 0 || isSendMessageDisable) {
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

    const reqData = {
      mid,
      text: text,
      chatId: selectedCID,
    };

    let response;
    try {
      response = await api.messageCreate(reqData);
    } catch (err) {
      showCustomAlert("The server connection is unavailable.", "warning");
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
      };

      dispatch(addMessage(msg));
      dispatch(
        updateLastMessageField({
          cid: selectedCID,
          resaveLastMessageId: mid,
          msg,
        })
      );
      dispatch(removeMessage(mid));
    }
    filePicker.current.value = "";
    isMobile && messageInputEl.current.blur();

    setIsSendMessageDisable(false);
    scrollChatToBottom();
    messageInputEl.current.focus();
    messageInputEl.current.style.height = `calc(70px * var(--base-scale))`;
  };

  const pickUserFiles = () => filePicker.current.click();

  useEffect(() => {
    messageInputEl.current.value = "";
    messageInputEl.current.style.height = `calc(70px * var(--base-scale))`;
  }, [selectedCID]);

  const handleInput = (e) => {
    if (messageInputEl.current) {
      const countOfLines = e.target.value.split("\n").length - 1;
      messageInputEl.current.style.height = `calc(${
        70 + countOfLines * 20 < 230 ? 70 + countOfLines * 20 : 230
      }px * var(--base-scale)) `;
      messageInputEl.current.scrollTop = messageInputEl.current.scrollHeight;
    }
  };

  const handeOnKeyDown = (e) => {
    if (
      e.keyCode === 13 &&
      ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
    ) {
      sendMessage(e);
    }
  };

  return (
    <div className="inputs__container">
      <Attach className="input-file__button" onClick={pickUserFiles} />
      <input
        id="inputFile"
        ref={filePicker}
        //onChange open pop up window
        type="file"
        accept={globalConstants.allowedFileFormats}
        multiple
      />
      <textarea
        id="inputMessage"
        ref={messageInputEl}
        onTouchStart={(e) => !e.target.value.length && e.target.blur()}
        onInput={handleInput}
        onKeyDown={handeOnKeyDown}
        onBlur={handleInput}
        autoComplete="off"
        autoFocus={!isMobile}
        placeholder="Type your message..."
      />
      <Send className="input-text__button" onClick={sendMessage} />
    </div>
  );
}
