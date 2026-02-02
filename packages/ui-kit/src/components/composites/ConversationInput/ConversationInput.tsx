import { useEffect, useMemo, useRef, useState } from "react";

import { getAdapters } from "../../../adapters";

import { MagicButton } from "../../elements/MagicButton";
import { MessageInput } from "../../elements/MessageInput";

import { ConversationInputProps } from "./ConversationInput.type";

export const ConversationInput = ({
  chatMessagesBlockRef,
  editedMessage,
  isEnableMagicButton = true,
}: ConversationInputProps) => {
  const { useDrafts, useMessages, useConversations, useParticipants, formatedUtils } = getAdapters();
  const { saveDraft, saveLastInputText, getLastInputText, getDraftMessage, getExternalProps } = useDrafts();
  const { editMessage, createAndSendMessage } = useMessages();
  const { getSelectedConversation } = useConversations();
  const { getUserById } = useParticipants();
  const { calcInputHeight } = formatedUtils;

  const draftExtenralProps = getExternalProps();

  const selectedConversation = getSelectedConversation();
  const selectedCID = selectedConversation?._id;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  window.onresize = function () {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const disableInput = () => setIsSendMessageDisable(true);
  const enableInput = () => setIsSendMessageDisable(false);

  useEffect(() => {
    if (!inputRef.current) return;
    if (editedMessage) {
      inputRef.current.value && saveLastInputText(selectedCID, inputRef.current.value);
      saveDraft(selectedCID, { text: editedMessage.body });
      inputRef.current.value = editedMessage.body;
      inputRef.current.focus();
    } else {
      inputRef.current.value = getLastInputText(selectedCID);
      saveDraft(selectedCID, { text: inputRef.current.value });
    }
  }, [editedMessage]);

  useEffect(() => {
    if (inputRef.current) {
      const draftText = getDraftMessage(selectedCID) || "";
      inputRef.current.value = draftText;
      inputRef.current.style.height = `${calcInputHeight(draftText)}px`;
    }
  }, [selectedCID]);

  useEffect(() => {
    draftExtenralProps[selectedCID]?.draft_replied_mid && inputRef.current?.focus();
  }, [draftExtenralProps]);

  const isBlockedConv = useMemo(() => {
    const { type, owner_id, opponent_id } = selectedConversation;

    return type === "u" && !getUserById(opponent_id || owner_id)?.login;
  }, [selectedConversation, getUserById]);

  return (
    <div className="flex w-full items-end gap-2.5 self-center pb-3.5 lg:max-w-300">
      <MessageInput
        inputTextRef={inputRef}
        isBlockedConv={isBlockedConv}
        isEditAction={!!editedMessage}
        isSending={isSendMessageDisable}
        isMobile={false}
        onSubmitFunc={() => {
          editedMessage
            ? editMessage(inputRef, editedMessage)
            : createAndSendMessage(
                inputRef,
                selectedConversation,
                draftExtenralProps,
                isSendMessageDisable,
                disableInput,
                enableInput,
                () => {
                  chatMessagesBlockRef.current.scrollTop = chatMessagesBlockRef.current.scrollHeight;
                  inputRef.current && (inputRef.current.style.height = `55px`);
                },
              );
        }}
      />
      {isEnableMagicButton ? <MagicButton isBlockedConv={isBlockedConv} inputTextRef={inputRef} /> : null}
    </div>
  );
};
