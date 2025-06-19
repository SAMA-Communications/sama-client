import { useMemo } from "react";
import { useSelector } from "react-redux";

import draftService from "@services/draftService.js";

import ContextLink from "@components/context/elements/ContextLink";

import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";

import Reply from "@icons/context/Reply.svg?react";

export default function MessageLinks({ listOfIds }) {
  const selectedCID = useSelector(getSelectedConversationId);

  const { mid } = useSelector(selectContextExternalProps);

  const links = {
    messageReply: (
      <ContextLink
        key={"messageReply"}
        text="Reply"
        icon={<Reply />}
        onClick={() => {
          draftService.saveDraft(selectedCID, { replied_mid: mid }, true);
        }}
      />
    ),
  };

  return useMemo(
    () => listOfIds.map((linkId) => links[linkId]).filter(Boolean),
    [listOfIds]
  );
}
