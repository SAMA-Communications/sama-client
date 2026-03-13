import { useEffect, useRef } from "react";

import localforage from "localforage";
import { Paperclip, Send, Check } from "lucide-react";

import { getAdapters } from "@adapters";

import { MagicButton } from "@elements/MagicButton";
import { MessageInputProps } from "@elements/MessageInput/MessageInput.type";
import { OvalLoader } from "@elements/OvalLoader";

import { KEY_CODES, TYPING_DURATION_MS } from "@utils/constants";

export const MessageInput = ({
  inputTextRef,
  onSubmitFunc,
  isBlockedConv,
  isEditAction,
  isMobile = false,
  isSending = false,
  isEnableMagicButton = false,
  onOpenAttachmentHub,
  isLocationIncludeAttach = false,
}: MessageInputProps) => {
  const { useConversations, useDrafts, formatedUtils, mediaUtils } = getAdapters();
  const { getSelectedConversation, sendTypingStatus } = useConversations();
  const { saveDraft, removeDraftWithOptions, getDraftMessage } = useDrafts();
  const { calcInputHeight } = formatedUtils;
  const { extractFilesFromClipboard } = mediaUtils;

  const lastTypingRequestTime = useRef<number | null>(null);

  const selectedConversation = getSelectedConversation();
  const selectedConversationId = selectedConversation._id;

  const handleInput = (e: any) => {
    const text = e.target.value;
    if (text.length > 0) {
      const typingDuration = TYPING_DURATION_MS;
      if (!lastTypingRequestTime.current || Date.now() - lastTypingRequestTime.current > typingDuration - 1000) {
        sendTypingStatus(selectedConversationId);
        lastTypingRequestTime.current = Date.now();
      }
    }

    if (inputTextRef.current) {
      text?.length > 0
        ? saveDraft(selectedConversationId, { text })
        : removeDraftWithOptions(selectedConversationId, "text");
      inputTextRef.current.style.height = `${calcInputHeight(text)}px`;
      inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
    }
  };

  const handeOnKeyDown = (e: any) => {
    if (e.keyCode === KEY_CODES.ENTER && ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))) {
      e.preventDefault();
      onSubmitFunc(e);
    }
  };

  const storeInputText = () => {
    const inputText = inputTextRef.current?.value;
    if (inputText) {
      saveDraft(selectedConversationId, { text: inputText });
      inputTextRef.current.value = "";
      inputTextRef.current.style.height = `28px`;
    }
  };

  const syncInputText = () => {
    const message = isLocationIncludeAttach ? "" : getDraftMessage(selectedConversationId);
    if (message && !isEditAction) {
      if (inputTextRef.current) {
        inputTextRef.current.value = message || "";
        inputTextRef.current.style.height = `${calcInputHeight(message || "")}px`;
        inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
      }
    }
  };

  useEffect(() => syncInputText(), []); //location

  useEffect(() => {
    function preventDefaults(e: any) {
      e.preventDefault();
      e.stopPropagation();
    }

    function handleInput(e: any) {
      if (!selectedConversationId) return;

      let files: File[] = [];
      const clipboardItems = e.clipboardData || e.originalEvent?.clipboardData;
      if (clipboardItems?.items) {
        files = extractFilesFromClipboard(clipboardItems);
      } else if (e.dataTransfer?.files) {
        files = Array.from(e.dataTransfer.files);
      }

      if (!files.length) return;
      localforage.setItem("attachFiles", files);
      onOpenAttachmentHub?.();
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
  }, [selectedConversationId, onOpenAttachmentHub]);

  return (
    <div className="ui:flex ui:w-full ui:gap-2.5">
      <button
        className="ui:h-max ui:cursor-pointer ui:self-end ui:rounded-xl ui:bg-white ui:p-2 ui:text-text-dark ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white"
        onClick={() => {
          if (!isSending) {
            onOpenAttachmentHub?.();
            storeInputText();
          }
        }}
      >
        <Paperclip size={28} />
      </button>
      <div className="ui:flex ui:grow ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn">
        <textarea
          className={`ui:max-h-full ui:grow ui:resize-none ui:text-base ui:font-light ui:placeholder:text-base ui:focus:outline-hidden ui:max-xl:disabled:p-2.25 ui:[&::-webkit-scrollbar]:hidden`}
          ref={inputTextRef}
          onInput={handleInput}
          onKeyDown={handeOnKeyDown}
          onBlur={handleInput}
          autoComplete="off"
          autoFocus={!isMobile}
          disabled={isSending}
          placeholder={"Type your message..."}
        />
        {isEnableMagicButton ? <MagicButton isBlockedConv={isBlockedConv} inputTextRef={inputTextRef} /> : null}
      </div>
      <button
        className="ui:h-max ui:cursor-pointer ui:self-end ui:rounded-xl ui:bg-white ui:p-2 ui:text-text-dark ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white"
        onClick={isSending ? undefined : (e: React.MouseEvent<HTMLButtonElement>) => onSubmitFunc(e as any)}
      >
        {isSending ? <OvalLoader width={28} height={28} /> : isEditAction ? <Check size={28} /> : <Send size={28} />}
      </button>
    </div>
  );
};
