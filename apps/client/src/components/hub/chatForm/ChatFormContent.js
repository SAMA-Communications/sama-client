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

  const conversation = useSelector(getConverastionById);
  const messagesEntities = useSelector(selectMessagesEntities);
  const messages = Object.values(messagesEntities);

  const draftRepliedMessage = useMemo(() => {
    return conversation.draft?.replied_mid
      ? messagesEntities[conversation.draft?.replied_mid]
      : null;
  }, [conversation]);

  const chatContentView = useMemo(() => {
    if (!messages) {
      return (
        <CustomScrollBar customId={"chatMessagesScrollable"}>
          <SMessageList />
        </CustomScrollBar>
      );
    }

    if (messages.length) {
      return (
        <CustomScrollBar customId={"chatMessagesScrollable"}>
          <MessagesList scrollRef={chatMessagesBlock} />
        </CustomScrollBar>
      );
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
      <ChatFormInputContent
        cid={conversation._id}
        message={draftRepliedMessage}
      />
      <ChatFormInput chatMessagesBlockRef={chatMessagesBlock} />
    </>
  );
}
