import { useMemo, useRef } from "react";
import { useSelector } from "react-redux";

import ChatFormInputs from "@components/hub/chatForm/ChatFormInputs.js";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MessagesList from "@components/hub/elements/MessagesList";
import SMessageList from "@skeletons/hub/elements/SMessageList";

import { selectActiveConversationMessages } from "@store/values/Messages";

export default function ChatFormContent() {
  const chatMessagesBlock = useRef(null);

  const messages = useSelector(selectActiveConversationMessages);

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
      <ChatFormInputs chatMessagesBlockRef={chatMessagesBlock} />
    </>
  );
}
