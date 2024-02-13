import MessageInput from "../elements/MessageInput";
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

export default function ChatFormInputs({ chatMessagesBlockRef }) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const currentUser = useSelector(getCurrentUser);
  const messages = useSelector(getActiveConversationMessages);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const inputRef = useRef(null);
  const filePicker = useRef(null);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  window.onresize = function () {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const createAndSendMessage = async () => {
    if (!connectState) {
      showCustomAlert("No internet connection…", "warning");
      return;
    }

    const body = inputRef.current.value.trim();
    if (body.length === 0 || isSendMessageDisable) {
      return;
    }
    setIsSendMessageDisable(true);
    inputRef.current.value = "";
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
    isMobile && inputRef.current.blur();

    setIsSendMessageDisable(false);
    chatMessagesBlockRef.current?._infScroll?.scrollIntoView({ block: "end" });
    inputRef.current.focus();
    inputRef.current.style.height = `calc(70px * var(--base-scale))`;
  };

  window.onresize = function () {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  useEffect(() => {
    inputRef.current.value = "";
    inputRef.current.style.height = `calc(70px * var(--base-scale))`;
  }, [selectedCID]);

  return (
    <MessageInput
      inputTextRef={inputRef}
      inputFileRef={filePicker}
      onSubmitFunc={createAndSendMessage}
    />
  );
}
