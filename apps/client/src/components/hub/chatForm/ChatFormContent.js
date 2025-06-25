import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import ChatFormInput from "@components/hub/chatForm/ChatFormInput.js";
import ChatFormInputContent from "@components/hub/chatForm/ChatFormInputContent.js";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MessagesList from "@components/hub/elements/MessagesList";

import { getConverastionById } from "@store/values/Conversations.js";
import { selectMessagesEntities } from "@store/values/Messages.js";

import SMessageList from "@skeletons/hub/elements/SMessageList";

export default function ChatFormContent() {
  const chatMessagesBlock = useRef(null);

  const selectedConversation = useSelector(getConverastionById);
  const messagesEntities = useSelector(selectMessagesEntities);
  const messages = Object.values(messagesEntities);

  const draftRepliedMessage = useMemo(() => {
    return selectedConversation.draft?.replied_mid
      ? messagesEntities[selectedConversation.draft?.replied_mid]
      : null;
  }, [selectedConversation]);

  const chatContentView = useMemo(() => {
    if (!messages) {
      return (
        <CustomScrollBar customId={"chatMessagesScrollable"}>
          <SMessageList />
        </CustomScrollBar>
      );
    }

    if (messages.length) {
      return <MessagesList scrollRef={chatMessagesBlock} />;
    }

    return (
      <div className="flex flex-grow items-end pb-[15px]">
        <p className="font-light text-[23px] text-(--color-text-light)">
          Write the first message...
        </p>
      </div>
    );
  }, [messages, chatMessagesBlock]);

  return (
    <>
      {chatContentView}
      <ChatFormInputContent message={draftRepliedMessage} />
      <ChatFormInput chatMessagesBlockRef={chatMessagesBlock} />
    </>
  );
}
