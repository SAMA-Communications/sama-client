import ContextLink from "@components/context/elements/ContextLink";
import { ReactComponent as Info } from "@icons/context/Info.svg";

export default function InfoChatLink({ onClick }) {
  return <ContextLink text="Info" icon={<Info />} onClick={onClick} />;
}
