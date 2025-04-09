import TextAreaInput from "@components/hub/elements/TextAreaInput";
import addSuffix from "@utils/navigation/add_suffix";
import api from "@api/api";
import isMobile from "@utils/get_device_type";
import { KEY_CODES } from "@utils/global/keyCodes";
import { getSelectedConversationId } from "@store/values/SelectedConversation";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Attach from "@icons/options/Attach.svg?react";
import Send from "@icons/options/Send.svg?react";

export default function MessageInput({
  inputTextRef,
  onSubmitFunc,
  isBlockedConv,
  chatMessagesBlockRef,
}) {
  const location = useLocation();

  const selectedConversationId = useSelector(getSelectedConversationId);

  const [isPrevLocationAttach, setIsPrevLocationAttach] = useState(false);

  let lastTypingRequestTime = null;
  const handleInput = (e) => {
    if (e.target.value.length > 0) {
      if (new Date() - lastTypingRequestTime > 3000 || !lastTypingRequestTime) {
        api.sendTypingStatus({ cid: selectedConversationId });
        lastTypingRequestTime = new Date();
      }
    }

    if (inputTextRef.current) {
      const countOfLines = e.target.value.split("\n").length - 1;
      inputTextRef.current.style.height = `${
        55 + countOfLines * 20 < 230 ? 55 + countOfLines * 20 : 215
      }px`;
      inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
    }
  };

  const handeOnKeyDown = (e) => {
    if (
      e.keyCode === KEY_CODES.ENTER &&
      ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
    ) {
      e.preventDefault();
      onSubmitFunc();
    }
  };

  const storeInputText = () => {
    if (inputTextRef.current.value) {
      localStorage.setItem("mtext", inputTextRef.current.value);
      inputTextRef.current.value = "";
      inputTextRef.current.style.height = `55px`;
    }
  };

  const syncInputText = () => {
    const mtext = localStorage.getItem("mtext");
    if (mtext) {
      localStorage.removeItem("mtext");
      inputTextRef.current.value = mtext;
      handleInput({ target: { value: mtext } });
    }
  };

  useEffect(() => {
    const isCurrentLocationAttach = location.hash.includes("/attach");

    if (!isCurrentLocationAttach && isPrevLocationAttach) {
      chatMessagesBlockRef.current?._infScroll?.scrollIntoView({
        block: "end",
      });
      syncInputText();
    }

    setIsPrevLocationAttach(isCurrentLocationAttach);
  }, [location]);

  const inputsView = useMemo(() => {
    if (isBlockedConv) {
      return (
        <p style={{ alignSelf: "center", marginLeft: 15, marginRight: 15 }}>
          The user you are currently chatting with has deleted their account.
          You can no longer continue the chat.
        </p>
      );
    }

    return (
      <>
        <Attach
          style={{
            width: 55,
            height: 45,
            paddingLeft: 10,
            paddingBottom: 12,
            cursor: "pointer",
          }}
          onClick={() => {
            addSuffix(location.pathname + location.hash, "/attach");
            storeInputText();
          }}
        />
        <TextAreaInput
          inputRef={inputTextRef}
          handleInput={handleInput}
          handeOnKeyDown={handeOnKeyDown}
          isDisabled={false}
          isMobile={isMobile}
          placeholder={"Type your message..."}
        />
        <Send
          style={{
            width: 55,
            height: 55,
            marginRight: 10,
            paddingLeft: 8,
            paddingRight: 8,
            cursor: "pointer",
          }}
          onClick={onSubmitFunc}
        />
      </>
    );
  }, [location, isBlockedConv, onSubmitFunc]);

  return (
    <div
      style={{
        minHeight: 60,
        paddingTop: 3,
        paddingBottom: 3,
        flexShrink: 1,
        display: "flex",
        alignItems: "flex-end",
        gap: 5,
        borderRadius: 16,
        backgroundColor: "var(--color-hover-light)",
      }}
    >
      {inputsView}
    </div>
  );
}
