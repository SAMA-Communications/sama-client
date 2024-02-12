import globalConstants from "@helpers/constants.js";
import isMobile from "@utils/get_device_type.js";
import messagesService from "@services/messagesService";
import showCustomAlert from "@utils/show_alert";
import {
  addMessage,
  getActiveConversationMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { getCurrentUser } from "@store/values/CurrentUser";
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
  const { current: inputEl } = messageInputEl;

  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const currentUser = useSelector(getCurrentUser);
  const messages = useSelector(getActiveConversationMessages);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const filePicker = useRef(null);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  const scrollChatToBottom = () =>
    chatMessagesBlockRef.current?._infScroll?.scrollIntoView({ block: "end" });

  const pickUserFiles = () => filePicker.current.click();

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!connectState) {
      showCustomAlert("No internet connection…", "warning");
      return;
    }

    const body = inputEl.value.trim();
    if (body.length === 0 || isSendMessageDisable) {
      return;
    }
    setIsSendMessageDisable(true);
    inputEl.value = "";
    const mid = currentUser._id + Date.now();
    const msg = {
      _id: mid,
      body,
      from: currentUser._id,
      t: Date.now(),
    };

    dispatch(addMessage(msg));
    dispatch(updateLastMessageField({ cid: selectedCID, msg }));

    const mObject = { mid, body, cid: selectedCID, from: currentUser._id };

    try {
      await messagesService.sendMessage(mObject);
    } catch (e) {
      showCustomAlert("The server connection is unavailable.", "warning");
      dispatch(
        setLastMessageField({
          cid: selectedCID,
          msg: messages[messages.length - 1],
        })
      );
      return;
    }

    filePicker.current.value = "";
    isMobile && inputEl.blur();

    setIsSendMessageDisable(false);
    scrollChatToBottom();
    inputEl.focus();
    inputEl.style.height = `calc(70px * var(--base-scale))`;
  };

  useEffect(() => {
    messageInputEl.current.value = "";
    messageInputEl.current.style.height = `calc(70px * var(--base-scale))`;
  }, [selectedCID]);

  const handleInput = (e) => {
    if (inputEl) {
      const countOfLines = e.target.value.split("\n").length - 1;
      inputEl.style.height = `calc(${
        70 + countOfLines * 20 < 230 ? 70 + countOfLines * 20 : 230
      }px * var(--base-scale)) `;
      inputEl.scrollTop = inputEl.scrollHeight;
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
