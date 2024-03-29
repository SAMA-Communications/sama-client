import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import MessagesList from "@components/hub/elements/MessagesList";
import SMessageList from "@skeletons/hub/elements/SMessageList";
import { selectActiveConversationMessages } from "@store/values/Messages";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function ChatFormContent({ scrollRef }) {
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
          <MessagesList scrollRef={scrollRef} />
        </CustomScrollBar>
      );
    }

    return (
      <div className="chat-content__container">
        <p className="chat-emty__text">Write the first message...</p>
      </div>
    );
  }, [messages, scrollRef]);

  return chatContentView;
}
