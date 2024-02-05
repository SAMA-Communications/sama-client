import MessagesList from "@screens/chat/MessagesList";
import { getActiveConversationMessages } from "@store/values/Messages";
import { useSelector } from "react-redux";

export default function ChatFormContent({ scrollRef }) {
  const messages = useSelector(getActiveConversationMessages);

  return (
    <div id="chatMessagesScrollable">
      {messages.length ? (
        <MessagesList scrollRef={scrollRef} />
      ) : (
        <p className="chat-emty__text">Write the first message...</p>
      )}
    </div>
  );
}
