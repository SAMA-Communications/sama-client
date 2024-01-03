import MessagesList from "@screens/chat/MessagesList";
import { getActiveConversationMessages } from "@store/Messages";
import { useSelector } from "react-redux";

import { ReactComponent as EmptyChat } from "@icons/chatForm/EmptyChat.svg";

export default function ChatFormMain({ scrollRef }) {
  const messages = useSelector(getActiveConversationMessages);

  return !messages.length ? (
    <div className="chat-empty">
      <EmptyChat />
      <p>Please type your message...</p>
    </div>
  ) : (
    <div id="chatMessagesScrollable">
      <MessagesList scrollRef={scrollRef} />
    </div>
  );
}
