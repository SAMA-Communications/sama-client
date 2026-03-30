import { useMemo, useRef, useSyncExternalStore } from "react";

import { useSelector } from "react-redux";

import { AnimatePresence } from "motion/react";

import ChatFormInputContent from "@components/hub/chatForm/ChatFormInputContent";
import MessagesList from "@components/hub/elements/MessagesList";
import SummaryContainer from "@components/hub/elements/SummaryContainer";

import useDrafts from "@hooks/api/useDrafts.js";

import { getDraftRevisionSnapshot, subscribeDraftRevision } from "@lib/draftsEngine.js";

import { CustomVerticalScrollbar, ConversationInput } from "@sama-communications.ui-kit";
import { MessageListSkeleton } from "@sama-communications.ui-kit";

import { selectContextExternalProps } from "@store/values/ContextMenu.js";
import { getConverastionById } from "@store/values/Conversations.js";
import { selectMessagesEntities } from "@store/values/Messages.js";

export default function ChatFormContent({ onOpenAttachmentHub, isLocationIncludeAttach }) {
  const chatMessagesBlock = useRef(null);

  const { getDraft, getDraftEditedMessageId, getDraftRepliedMessageId } = useDrafts();

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const messagesEntities = useSelector(selectMessagesEntities);
  const messages = Object.values(messagesEntities);

  const draftExtenralProps = useSelector(selectContextExternalProps);

  const localDraftRevision = useSyncExternalStore(
    (onStoreChange) => (selectedCID ? subscribeDraftRevision(selectedCID, onStoreChange) : () => {}),
    () => (selectedCID ? getDraftRevisionSnapshot(selectedCID) : 0),
    () => 0,
  );

  const draftRepliedMessage = useMemo(() => {
    const repliedMessageId =
      draftExtenralProps[selectedCID]?.draft_replied_mid || getDraftRepliedMessageId(selectedCID);
    return messagesEntities[repliedMessageId];
  }, [
    selectedConversation,
    draftExtenralProps,
    messagesEntities,
    selectedCID,
    getDraftRepliedMessageId,
    localDraftRevision,
  ]);
  const draftForwardedMessage = useMemo(() => {
    const localDraft = getDraft(selectedCID);
    const forwardedMessageId = localDraft.forwarded_mids ?? selectedConversation?.draft?.forwarded_mids;
    return forwardedMessageId?.map((mid) => messagesEntities[mid]);
  }, [selectedConversation, messagesEntities, selectedCID, getDraft, localDraftRevision]);
  const draftEditedMessage = useMemo(() => {
    const editedMessageId =
      draftExtenralProps[selectedCID]?.draft_edited_mid || getDraftEditedMessageId(selectedCID);
    return messagesEntities[editedMessageId];
  }, [
    selectedConversation,
    draftExtenralProps,
    messagesEntities,
    selectedCID,
    getDraftEditedMessageId,
    localDraftRevision,
  ]);

  const chatContentView = useMemo(() => {
    if (!messages) {
      return (
        <CustomVerticalScrollbar
          customId="chatMessagesScrollable"
          customClassName="rounded-3xl h-[calc(100%+9px)]!"
          childrenClassName="py-1.5"
        >
          <MessageListSkeleton />
        </CustomVerticalScrollbar>
      );
    }

    if (messages.length) {
      return <MessagesList scrollRef={chatMessagesBlock} />;
    }

    return (
      <div className="flex w-full grow items-end self-center pb-1.5 lg:max-w-300">
        <p className="text-text-light text-xl font-light">Write the first message...</p>
      </div>
    );
  }, [messages, chatMessagesBlock]);

  return (
    <>
      <AnimatePresence>
        <SummaryContainer summaryContent={selectedConversation?.summary} />
      </AnimatePresence>
      {chatContentView}
      <ChatFormInputContent
        editedMessage={draftEditedMessage}
        repliedMessage={draftRepliedMessage}
        forwardedMessages={draftForwardedMessage}
      />
      <ConversationInput
        chatMessagesBlockRef={chatMessagesBlock}
        editedMessage={draftEditedMessage}
        onOpenAttachmentHub={onOpenAttachmentHub}
        isLocationIncludeAttach={isLocationIncludeAttach}
      />
    </>
  );
}
