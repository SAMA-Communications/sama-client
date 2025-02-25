import ContextLink from "@components/context/elements/ContextLink";
import Info from "@icons/context/Info.svg?react";

export default function InfoChatLink({ onClick }) {
  return <ContextLink text="Info" icon={<Info />} onClick={onClick} />;
}
