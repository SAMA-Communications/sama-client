import LastMessageStatus from "@components/message/lastMessage/LastMessageStatus";

export default function MessageIndicator({ message, userId, count }) {
  return count > 0 ? (
    <div className="content-bottom__indicator">{count}</div>
  ) : (
    <LastMessageStatus message={message} userId={userId} />
  );
}
