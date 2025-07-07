import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import draftService from "@services/tools/draftService.js";

import ContextLink from "@components/context/elements/ContextLink";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";

import Reply from "@icons/context/Reply.svg?react";

export default function MessageActions({ listOfIds }) {
  const dispatch = useDispatch();

  const selectedCID = useSelector(getSelectedConversationId);

  const { mid } = useSelector(selectContextExternalProps);

  const links = {
    messageReply: (
      <ContextLink
        key={"messageReply"}
        text="Reply"
        icon={<Reply />}
        onClick={() => {
          dispatch(
            addExternalProps({ [selectedCID]: { draft_replied_mid: mid } })
          );
          draftService.saveDraft(selectedCID, { replied_mid: mid });
        }}
      />
    ),
  };

  return useMemo(
    () => listOfIds.map((linkId) => links[linkId]).filter(Boolean),
    [listOfIds]
  );
}
