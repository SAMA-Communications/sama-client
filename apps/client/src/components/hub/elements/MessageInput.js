import * as m from "motion/react-m";
import localforage from "localforage";
import { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";

import api from "@api/api";

import TextAreaInput from "@components/hub/elements/TextAreaInput";

import { OvalLoader } from "@sama-communications.ui-kit";

import draftService from "@services/tools/draftService.js";

import { getSelectedConversationId } from "@store/values/SelectedConversation";

import { addSuffix } from "@utils/NavigationUtils.js";
import { calcInputHeight } from "@utils/FormatedUtils.js";
import { extractFilesFromClipboard } from "@utils/MediaUtils.js";
import { isMobile } from "@utils/GeneralUtils.js";
import { KEY_CODES, TYPING_DURATION_MS } from "@utils/constants.js";

import Attach from "@icons/options/Attach.svg?react";
import Send from "@icons/options/Send.svg?react";
import Confirm from "@icons/options/ConfirmAccent.svg?react";

export default function MessageInput({
  inputTextRef,
  onSubmitFunc,
  isBlockedConv,
  isEditAction,
  isSending = false,
}) {
  const location = useLocation();

  const lastTypingRequestTime = useRef(null);

  const selectedConversationId = useSelector(getSelectedConversationId);

  const handleInput = (e) => {
    const text = e.target.value;
    if (text.length > 0) {
      const typingDuration = TYPING_DURATION_MS;
      if (
        Date.now() - lastTypingRequestTime.current > typingDuration - 1000 ||
        !lastTypingRequestTime.current
      ) {
        api.sendTypingStatus({ cid: selectedConversationId });
        lastTypingRequestTime.current = Date.now();
      }
    }

    if (inputTextRef.current) {
      text?.length > 0
        ? draftService.saveDraft(selectedConversationId, { text })
        : draftService.removeDraftWithOptions(selectedConversationId, "text");
      inputTextRef.current.style.height = `${calcInputHeight(text)}px`;
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
    const inputText = inputTextRef.current?.value;
    if (inputText) {
      draftService.saveDraft(selectedConversationId, { text: inputText });
      inputTextRef.current.value = "";
      inputTextRef.current.style.height = `55px`;
    }
  };

  const syncInputText = () => {
    const message = location.hash.includes("/attach")
      ? ""
      : draftService.getDraftMessage(selectedConversationId);
    if (message && !isEditAction) {
      if (inputTextRef.current) {
        inputTextRef.current.value = message || "";
        inputTextRef.current.style.height = `${calcInputHeight(
          message || ""
        )}px`;
        inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => syncInputText(), [location]);

  useEffect(() => {
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    function handleInput(e) {
      if (!selectedConversationId) return;

      let files = [];
      const clipboardItems = e.clipboardData || e.originalEvent?.clipboardData;
      if (clipboardItems?.items) {
        files = extractFilesFromClipboard(clipboardItems);
      } else if (e.dataTransfer?.files) {
        files = Array.from(e.dataTransfer.files);
      }

      if (!files.length) return;
      localforage.setItem("attachFiles", files);
      addSuffix(location.pathname + location.hash, "/attach");
      storeInputText();
    }

    document.addEventListener("dragover", preventDefaults);
    document.addEventListener("dragenter", preventDefaults);
    document.addEventListener("dragleave", preventDefaults);
    document.addEventListener("drop", handleInput);
    document.addEventListener("paste", handleInput);

    return () => {
      document.removeEventListener("dragover", preventDefaults);
      document.removeEventListener("dragenter", preventDefaults);
      document.removeEventListener("dragleave", preventDefaults);
      document.removeEventListener("drop", handleInput);
      document.removeEventListener("paste", handleInput);
    };
  }, [selectedConversationId, location]);

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
            className="w-[55px] h-[45px] pl-[10px] pb-[12px] cursor-pointer"
            onClick={
              isSending
                ? null
                : () => {
                    addSuffix(location.pathname + location.hash, "/attach");
                    storeInputText();
                  }
            }
          />
        </m.span>
        <TextAreaInput
          inputRef={inputTextRef}
          customClassName="max-h-full grow py-[12px] text-black !font-light  resize-none max-xl:disabled:!p-[9px] placeholder:text-(--color-text-dark) placeholder:text-p [&::-webkit-scrollbar]:hidden"
          handleInput={handleInput}
          handeOnKeyDown={handeOnKeyDown}
          isDisabled={isSending}
          isMobile={isMobile}
          placeholder={"Type your message..."}
        />
        {isSending ? (
          <OvalLoader
            width={35}
            height={35}
            wrapperClassName="mr-[10px] px-[8px] self-center"
          />
        ) : isEditAction ? (
          <m.span whileTap={{ translateX: 10, scale: 0.9 }}>
            <Confirm
              className="mr-[15px] px-[8px] !w-[50px] !h-[50px] cursor-pointer"
              onClick={onSubmitFunc}
            />
          </m.span>
        ) : (
          <m.span whileTap={{ translateX: 10, scale: 0.9 }}>
            <Send
              className="mr-[10px] px-[8px] !w-[55px] !h-[55px] cursor-pointer"
              onClick={onSubmitFunc}
            />
          </m.span>
        )}
      </>
    );
  }, [location, isBlockedConv, isSending, onSubmitFunc]);

  return (
    <div className="min-h-[60px] py-[3px] shrink flex items-end gap-[5px] rounded-[16px] bg-(--color-hover-light) overflow-hidden z-5">
      {inputsView}
    </div>
  );
}
