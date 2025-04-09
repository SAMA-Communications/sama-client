import MessageInput from "@components/hub/elements/MessageInput";
import messagesService from "@services/messagesService";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import {
  addMessage,
  removeMessage,
  selectActiveConversationMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  removeChat,
  removeLastMessage,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { getNetworkState } from "@store/values/NetworkState";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import "@styles/hub/chatForm/ChatFormInputs.css";

export default function ChatFormInputs({ chatMessagesBlockRef }) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const currentUserId = useSelector(selectCurrentUserId);
  const messages = useSelector(selectActiveConversationMessages);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const inputRef = useRef(null);
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
    const mid = currentUserId + Date.now();
    const msg = {
      _id: mid,
      body,
      from: currentUserId,
      t: Date.now(),
    };

    dispatch(addMessage(msg));
    dispatch(updateLastMessageField({ cid: selectedCID, msg }));

    const mObject = { mid, body, cid: selectedCID, from: currentUserId };
    inputRef.current.focus(); //care..

    try {
      await messagesService.sendMessage(mObject);
    } catch (e) {
      showCustomAlert(
        e.message || "The server connection is unavailable.",
        "warning"
      );
      dispatch(
        setLastMessageField({
          cid: selectedCID,
          msg: messages[messages.length - 1],
        })
      );
      dispatch(removeLastMessage({ cid: selectedCID }));
      dispatch(removeMessage(mObject.mid));
      inputRef.current.value = body;
      setIsSendMessageDisable(false);

      if (e.status === 403) {
        dispatch(removeChat(selectedCID));
        dispatch(setSelectedConversation({}));
        navigateTo("/");
      }
      return;
    }

    setIsSendMessageDisable(false);
    // chatMessagesBlockRef.current?._infScroll?.scrollIntoView({ block: "end" });
    // inputRef.current.focus(); //care..
    window.scrollTo(0, document.body.scrollHeight - 200);
    inputRef.current.style.height = `55px`;
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
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.style.height = `55px`;
    }
  }, [selectedCID]);

  const isBlockedConv = useMemo(() => {
    const { type, owner_id, opponent_id } = selectedConversation;

    return (
      type === "u" &&
      (!participants[opponent_id]?.login || !participants[owner_id]?.login)
    );
  }, [selectedConversation, participants]);

  return (
    <MessageInput
      inputTextRef={inputRef}
      isBlockedConv={isBlockedConv}
      onSubmitFunc={createAndSendMessage}
      chatMessagesBlockRef={chatMessagesBlockRef}
    />
  );
}
