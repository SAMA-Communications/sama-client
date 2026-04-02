import { useEffect, useMemo, useRef, useState } from "react";

import { clsx } from "clsx";

import { getAdapters } from "@adapters";

import type { ConversationInputProps } from "@composites/ConversationInput/ConversationInput.type";

import { MessageInput } from "@elements/MessageInput";
import { WrapperRoot } from "@elements/WrapperRoot";

export const ConversationInput = ({
  chatMessagesBlockRef,
  editedMessage,
  isEnableMagicButton = true,
  onOpenAttachmentHub,
  isLocationIncludeAttach,
  className,
  ...rest
}: ConversationInputProps) => {
  const { useDrafts, useMessages, useConversations, useParticipants, formatedUtils } = getAdapters();
  const {
    saveDraft,
    savePreEditComposeText,
    consumePreEditComposeText,
    getDraft,
    getDraftEditedMessageId,
    getDraftMessage,
    getExternalProps,
  } = useDrafts();
  const { editMessage, createAndSendMessage } = useMessages();
  const { getSelectedConversation } = useConversations();
  const { getUserById } = useParticipants();
  const { calcInputHeight } = formatedUtils;

  const draftExtenralProps = getExternalProps();

  const selectedConversation = getSelectedConversation();
  const selectedCID = selectedConversation?._id;

  const inputRef = useRef<HTMLInputElement>(null);
  const prevCidRef = useRef<string | undefined>(undefined);
  const wasInEditModeRef = useRef(false);
  const skipExitDraftRestoreRef = useRef(false);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (inputRef.current) {
        inputRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onSubmitFunc = async () => {
    const inputValue = inputRef.current?.value?.trim();
    if (inputValue === undefined) return;
    let body;
    if (editedMessage) {
      body = await editMessage(inputValue, selectedConversation, editedMessage);
      skipExitDraftRestoreRef.current = true;
    } else {
      body = await createAndSendMessage(
        inputValue,
        selectedConversation,
        draftExtenralProps,
        isSendMessageDisable,
        disableInput,
        enableInput,
        () => {
          if (inputRef.current) {
            inputRef.current.style.height = `28px`;
          }
        },
      );
      setTimeout(() => {
        inputRef.current?.focus({ preventScroll: true });
        const messagesBlock = chatMessagesBlockRef.current;
        if (messagesBlock) {
          messagesBlock.scrollTop = messagesBlock.scrollHeight;
        }
      }, 50);
    }
    inputRef.current && (inputRef.current.value = body || "");
  };

  const disableInput = () => setIsSendMessageDisable(true);
  const enableInput = () => setIsSendMessageDisable(false);

  useEffect(() => {
    if (!inputRef.current || !selectedCID) return;

    const cidChanged = prevCidRef.current !== selectedCID;
    if (cidChanged) {
      prevCidRef.current = selectedCID;
      wasInEditModeRef.current = false;
      skipExitDraftRestoreRef.current = false;
    }

    if (editedMessage) {
      if (!wasInEditModeRef.current) {
        const composeSnapshot = inputRef.current?.value ?? "";
        if (composeSnapshot.length > 0) savePreEditComposeText(selectedCID, composeSnapshot);
      }
      wasInEditModeRef.current = true;
      const diskDraft = getDraft(selectedCID);
      const sameEdit = getDraftEditedMessageId(selectedCID) === editedMessage._id;
      const hasPersistedText = Object.prototype.hasOwnProperty.call(diskDraft, "text");
      const textForInput =
        sameEdit && hasPersistedText ? (diskDraft.text == null ? "" : String(diskDraft.text)) : editedMessage.body;
      saveDraft(selectedCID, { text: textForInput });
      inputRef.current.value = textForInput;
      inputRef.current.style.height = `${calcInputHeight(textForInput)}px`;
      inputRef.current?.focus({ preventScroll: true });
      return;
    }

    if (wasInEditModeRef.current && !cidChanged) {
      if (skipExitDraftRestoreRef.current) {
        skipExitDraftRestoreRef.current = false;
        wasInEditModeRef.current = false;
        return;
      }
      const restored = consumePreEditComposeText(selectedCID);
      inputRef.current.value = restored;
      saveDraft(selectedCID, { text: restored });
      inputRef.current.style.height = `${calcInputHeight(restored)}px`;
      return;
    }

    wasInEditModeRef.current = false;
    const draftText = getDraftMessage(selectedCID) || "";
    inputRef.current.value = draftText;
    inputRef.current.style.height = `${calcInputHeight(draftText)}px`;
  }, [selectedCID, editedMessage]);

  useEffect(() => {
    draftExtenralProps[selectedCID]?.draft_replied_mid && inputRef.current?.focus();
  }, [draftExtenralProps]);

  const isBlockedConv = useMemo(() => {
    const { type, owner_id, opponent_id } = selectedConversation;
    return (
      type === "u" && !(opponent_id && getUserById(opponent_id)?.login && owner_id && getUserById(owner_id)?.login)
    );
  }, [selectedConversation, getUserById]);

  if (isBlockedConv) {
    return (
      <WrapperRoot
        className={clsx(
          "ui:mb-3.5 ui:flex ui:min-h-11 ui:w-full ui:justify-center ui:gap-2.5 ui:self-center ui:overflow-hidden ui:p-2 ui:pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] ui:lg:max-w-300",
          className,
        )}
        {...rest}
      >
        <p className="ui:font-light ui:text-text-dark">
          The user you are currently chatting with has deleted their account. You can no longer continue the chat.
        </p>
      </WrapperRoot>
    );
  }

  return (
    <WrapperRoot
      className={clsx(
        "ui:flex ui:w-full ui:items-end ui:gap-2.5 ui:self-center ui:pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] ui:lg:max-w-300",
        className,
      )}
      {...rest}
    >
      <MessageInput
        inputTextRef={inputRef}
        isBlockedConv={isBlockedConv}
        isEditAction={!!editedMessage}
        isSending={isSendMessageDisable}
        isMobile={false}
        isEnableMagicButton={isEnableMagicButton}
        onSubmitFunc={onSubmitFunc}
        onOpenAttachmentHub={onOpenAttachmentHub}
        isLocationIncludeAttach={isLocationIncludeAttach}
      />
    </WrapperRoot>
  );
};
