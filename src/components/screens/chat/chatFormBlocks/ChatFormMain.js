import MessagesList from "../MessagesList";
import { getActiveConversationMessages } from "../../../../store/Messages";
import { useSelector } from "react-redux";

import { ReactComponent as EmptyChat } from "./../../../../assets/icons/chatForm/EmptyChat.svg";

export default function ChatFormMain({ scrollRef, open }) {
  const messages = useSelector(getActiveConversationMessages);

  return !messages.length ? (
    <div className="chat-empty">
      <EmptyChat />
      <p>Please type your message...</p>
    </div>
  ) : (
    <div id="chatMessagesScrollable">
      <MessagesList scrollRef={scrollRef} openModalFunc={open} />
    </div>
  );
}
