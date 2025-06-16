import { useMemo } from "react";

import ContextLink from "@components/context/elements/ContextLink";

import Reply from "@icons/context/Reply.svg?react";

export default function MessageLinks({ listOfIds }) {
  const links = {
    messageReply: (
      <ContextLink
        key={"messageReply"}
        text="Reply"
        icon={<Reply />}
        onClick={() => {}}
      />
    ),
  };

  return useMemo(
    () => listOfIds.map((linkId) => links[linkId]).filter(Boolean),
    [listOfIds]
  );
}
