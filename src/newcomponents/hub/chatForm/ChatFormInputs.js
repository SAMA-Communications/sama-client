import MessageInput from "../elements/MessageInput";
import isMobile from "@utils/get_device_type.js";
import messagesService from "@services/messagesService";
import showCustomAlert from "@utils/show_alert";
import {
  addMessage,
  selectActiveConversationMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { getNetworkState } from "@store/values/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import "@newstyles/hub/chatForm/ChatFormInputs.css";

export default function ChatFormInputs({ chatMessagesBlockRef }) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const currentUser = useSelector(selectCurrentUser);
  const messages = useSelector(selectActiveConversationMessages);
  const participants = useSelector(selectParticipantsEntities);
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
    inputRef.current.style.height = `calc(55px * var(--base-scale))`;
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
    inputRef.current.style.height = `calc(55px * var(--base-scale))`;
  }, [selectedCID]);

  const isBlockedConv = useMemo(() => {
    const { type, opponent_id } = selectedConversation;
    return type === "u" && !participants[opponent_id]?.login;
  }, [selectedConversation, participants]);

  return (
    <MessageInput
      inputTextRef={inputRef}
      inputFilesRef={filePicker}
      isBlockedConv={isBlockedConv}
      onSubmitFunc={createAndSendMessage}
    />
  );
}
