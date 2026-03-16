import { useMemo, useRef } from "react";

import { useSelector } from "react-redux";

import { AnimatePresence } from "motion/react";

import ChatFormInputContent from "@components/hub/chatForm/ChatFormInputContent";
import MessagesList from "@components/hub/elements/MessagesList";
import SummaryContainer from "@components/hub/elements/SummaryContainer";

import { CustomVerticalScrollbar, ConversationInput } from "@sama-communications.ui-kit";
import { MessageListSkeleton } from "@sama-communications.ui-kit";

import draftService from "@services/tools/draftService.js";

import { selectContextExternalProps } from "@store/values/ContextMenu.js";
import { getConverastionById } from "@store/values/Conversations.js";
import { selectActiveConversationMessagesEntities } from "@store/values/Messages.js";

export default function ChatFormContent({ onOpenAttachmentHub, isLocationIncludeAttach }) {
  const chatMessagesBlock = useRef(null);

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const messagesEntities = useSelector(selectActiveConversationMessagesEntities);
  const messages = Object.values(messagesEntities);

  const draftExtenralProps = useSelector(selectContextExternalProps);

  const draftRepliedMessage = useMemo(() => {
    const repliedMessageId =
      draftExtenralProps[selectedCID]?.draft_replied_mid || draftService.getDraftRepliedMessageId(selectedCID);
    return messagesEntities[repliedMessageId];
  }, [selectedConversation, draftExtenralProps, messagesEntities]);
  const draftForwardedMessage = useMemo(() => {
    const forwardedMessageId = selectedConversation?.draft?.forwarded_mids;
    return forwardedMessageId?.map((mid) => messagesEntities[mid]);
  }, [selectedConversation, draftExtenralProps, messagesEntities]);
  const draftEditedMessage = useMemo(() => {
    const editedMessageId =
      draftExtenralProps[selectedCID]?.draft_edited_mid || draftService.getDraftEditedMessageId(selectedCID);
    return messagesEntities[editedMessageId];
  }, [selectedConversation, draftExtenralProps, messagesEntities]);

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
