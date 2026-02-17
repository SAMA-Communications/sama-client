import { AnimatePresence } from "motion/react";
import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import draftService from "@services/tools/draftService.js";

import ChatFormInputContent from "@components/hub/chatForm/ChatFormInputContent.js";
import MessagesList from "@components/hub/elements/MessagesList";
import SummaryContainer from "@components/hub/elements/SummaryContainer.js";

import { CustomScrollBar, ConversationInput } from "@sama-communications.ui-kit";

import { getConverastionById } from "@store/values/Conversations.js";
import { selectMessagesEntities } from "@store/values/Messages.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";

import SMessageList from "@skeletons/hub/elements/SMessageList";

export default function ChatFormContent() {
  const chatMessagesBlock = useRef(null);

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const messagesEntities = useSelector(selectMessagesEntities);
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
        <CustomScrollBar
          customId={"chatMessagesScrollable"}
          customClassName="rounded-3xl h-[calc(100%+9px)]!"
          childrenClassName="py-1.5"
        >
          <SMessageList />
        </CustomScrollBar>
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
      <ConversationInput chatMessagesBlockRef={chatMessagesBlock} editedMessage={draftEditedMessage} />
    </>
  );
}
