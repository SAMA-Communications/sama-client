import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MessagesList from "@components/hub/elements/MessagesList";
import SMessageList from "@skeletons/hub/elements/SMessageList";
import { selectActiveConversationMessages } from "@store/values/Messages";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import ChatFormInputs from "@components/hub/chatForm/ChatFormInputs.js";

export default function ChatFormContent({ chatMessagesBlock }) {
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
          <MessagesList />
        </CustomScrollBar>
      );
    }

    return (
      <div className="flex flex-grow items-end pb-[15px]">
        <p className="font-light text-[23px]">Write the first message...</p>
      </div>
    );
  }, [messages]);

  return (
    <>
      {chatContentView}
      <ChatFormInputs chatMessagesBlockRef={chatMessagesBlock} />
    </>
  );
}
