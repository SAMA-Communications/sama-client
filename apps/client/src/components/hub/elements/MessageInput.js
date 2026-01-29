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

import { Paperclip, Send, Check } from "lucide-react";

export default function MessageInput({ inputTextRef, onSubmitFunc, isBlockedConv, isEditAction, isSending = false }) {
  const location = useLocation();

  const lastTypingRequestTime = useRef(null);

  const selectedConversationId = useSelector(getSelectedConversationId);

  const handleInput = (e) => {
    const text = e.target.value;
    if (text.length > 0) {
      const typingDuration = TYPING_DURATION_MS;
      if (Date.now() - lastTypingRequestTime.current > typingDuration - 1000 || !lastTypingRequestTime.current) {
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
    if (e.keyCode === KEY_CODES.ENTER && ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))) {
      e.preventDefault();
      onSubmitFunc();
    }
  };

  const storeInputText = () => {
    const inputText = inputTextRef.current?.value;
    if (inputText) {
      draftService.saveDraft(selectedConversationId, { text: inputText });
      inputTextRef.current.value = "";
      inputTextRef.current.style.height = `28px`;
    }
  };

  const syncInputText = () => {
    const message = location.hash.includes("/attach") ? "" : draftService.getDraftMessage(selectedConversationId);
    if (message && !isEditAction) {
      if (inputTextRef.current) {
        inputTextRef.current.value = message || "";
        inputTextRef.current.style.height = `${calcInputHeight(message || "")}px`;
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

  return isBlockedConv ? (
    <div className="border-text-dark flex h-11.5 grow items-center overflow-hidden rounded-xl border p-2">
      <p className="text-text-dark text-base">
        The user you are currently chatting with has deleted their account. You can no longer continue the chat.
      </p>
    </div>
  ) : (
    <div className="flex w-full gap-2.5 overflow-hidden">
      <div className="border-text-dark h-max self-end rounded-xl border p-2">
        <Paperclip
          size={28}
          color="var(--color-text-dark)"
          className="cursor-pointer self-center"
          onClick={
            isSending
              ? null
              : () => {
                  addSuffix(location.pathname + location.hash, "/attach");
                  storeInputText();
                }
          }
        />
      </div>
      <div className="border-text-dark flex grow rounded-xl border p-2">
        <TextAreaInput
          inputRef={inputTextRef}
          customClassName="max-h-full grow font-light text-base resize-none max-xl:disabled:p-2.25 placeholder:text-base [&::-webkit-scrollbar]:hidden"
          handleInput={handleInput}
          handeOnKeyDown={handeOnKeyDown}
          isDisabled={isSending}
          isMobile={isMobile}
          placeholder={"Type your message..."}
        />
      </div>
      <div className="border-text-dark h-max self-end rounded-xl border p-2">
        {isSending ? (
          <OvalLoader width={28} height={28} />
        ) : isEditAction ? (
          <Check size={28} color="var(--color-text-dark)" className="cursor-pointer" onClick={onSubmitFunc} />
        ) : (
          <Send size={28} color="var(--color-text-dark)" className="cursor-pointer" onClick={onSubmitFunc} />
        )}
      </div>
    </div>
  );
}
