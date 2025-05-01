import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { motion as m } from "framer-motion";

import api from "@api/api";

import TextAreaInput from "@components/hub/elements/TextAreaInput";

import { getSelectedConversationId } from "@store/values/SelectedConversation";

import addSuffix from "@utils/navigation/add_suffix";
import isMobile from "@utils/get_device_type";
import { KEY_CODES } from "@utils/global/keyCodes";

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
        <p className="self-center ml-[15px] mr-[15px]">
          The user you are currently chatting with has deleted their account.
          You can no longer continue the chat.
        </p>
      );
    }

    return (
      <>
        <m.span whileTap={{ scale: 0.8 }}>
          <Attach
            className="w-[55px] h-[45px] pl=[10px] pb-[12px] cursor-pointer"
            onClick={() => {
              addSuffix(location.pathname + location.hash, "/attach");
              storeInputText();
            }}
          />
        </m.span>
        <TextAreaInput
          inputRef={inputTextRef}
          customClassName="grow py-[12px] text-black !font-light  resize-none max-xl:disabled:!p-[9px] placeholder:text-(--color-text-dark) placeholder:text-p [&::-webkit-scrollbar]:hidden"
          handleInput={handleInput}
          handeOnKeyDown={handeOnKeyDown}
          isDisabled={false}
          isMobile={isMobile}
          placeholder={"Type your message..."}
        />
        <m.span whileTap={{ translateX: 10, scale: 0.9 }}>
          <Send
            className="mr-[10px] px-[8px] !w-[55px] !h-[55px] cursor-pointer"
            onClick={onSubmitFunc}
          />
        </m.span>
      </>
    );
  }, [location, isBlockedConv, onSubmitFunc]);

  return (
    <div className="min-h-[60px] py-[3px] shrink flex items-end gap-[5px] rounded-[16px] bg-(--color-hover-light) overflow-hidden">
      {inputsView}
    </div>
  );
}
