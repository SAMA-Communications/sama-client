import ContextLink from "@components/context/elements/ContextLink";
import SendMessage from "@icons/context/SendMessage.svg?react";

export default function SendMessageLink({ onClick }) {
  return (
    <ContextLink
      text="Write a message"
      icon={<SendMessage />}
      onClick={onClick}
    />
  );
}
