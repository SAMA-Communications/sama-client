import ContextLink from "@components/context/elements/ContextLink";

import Info from "@icons/context/Info.svg?react";

export default function InfoUserLink({ onClick }) {
  return <ContextLink text="Info" icon={<Info />} onClick={onClick} />;
}
