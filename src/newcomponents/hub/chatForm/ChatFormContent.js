import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import MessagesList from "@newcomponents/hub/elements/MessagesList";
import { getActiveConversationMessages } from "@store/values/Messages";
import { useSelector } from "react-redux";

export default function ChatFormContent({ scrollRef }) {
  const messages = useSelector(getActiveConversationMessages);

  return messages.length ? (
    <CustomScrollBar customId={"chatMessagesScrollable"}>
      <MessagesList scrollRef={scrollRef} />
    </CustomScrollBar>
  ) : (
    <div className="chat-content__container">
      <p className="chat-emty__text">Write the first message...</p>
    </div>
  );
}
