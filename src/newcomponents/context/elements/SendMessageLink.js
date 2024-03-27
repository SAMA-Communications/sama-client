import ContextLink from "@newcomponents/context/elements/ContextLink";
import { ReactComponent as SendMessage } from "@icons/context/SendMessage.svg";

export default function SendMessageLink({ onClick }) {
  return (
    <ContextLink
      text="Write a message"
      icon={<SendMessage />}
      onClick={onClick}
    />
  );
}
