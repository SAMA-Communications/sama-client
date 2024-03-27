import MessageStatus from "../elements/MessageStatus";

export default function LastMessageStatus({ message, userId }) {
  if (!message || message.from !== userId) {
    return null;
  }

  const { _id, status } = message;
  return <MessageStatus key={_id} status={status} />;
}
