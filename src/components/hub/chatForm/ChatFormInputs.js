import MessageInput from "@components/hub/elements/MessageInput";
import messagesService from "@services/messagesService";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import {
  addMessage,
  selectActiveConversationMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  removeChat,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { getNetworkState } from "@store/values/NetworkState";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import "@styles/hub/chatForm/ChatFormInputs.css";

export default function ChatFormInputs({ chatMessagesBlockRef }) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const currentUser = useSelector(selectCurrentUser);
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

      if (e.status === 403) {
        dispatch(removeChat(selectedCID));
        dispatch(setSelectedConversation({}));
        navigateTo("/");
      }
      return;
    }

    setIsSendMessageDisable(false);
    // chatMessagesBlockRef.current?._infScroll?.scrollIntoView({ block: "end" });
    window.scrollTo(0, document.body.scrollHeight);
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
    inputRef.current.value = "";
    inputRef.current.style.height = `55px`;
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
