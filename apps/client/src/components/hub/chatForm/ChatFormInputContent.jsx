import { useDispatch, useSelector } from "react-redux";

import AdditionalMessages from "@components/hub/elements/AdditionalMessages";

import useDrafts from "@hooks/api/useDrafts.js";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { getConverastionById } from "@store/values/Conversations.js";

export default function ChatFormInputContent({ editedMessage, repliedMessage, forwardedMessages = [] }) {
  const selectedCID = useSelector(getConverastionById)._id;
  const dispatch = useDispatch();
  const { removeDraftWithOptions } = useDrafts();

  const handleClose = () => {
    if (editedMessage) {
      dispatch(addExternalProps({ [editedMessage.cid]: {} }));
      removeDraftWithOptions(editedMessage.cid, "edited_mid");
    } else if (forwardedMessages.length) {
      removeDraftWithOptions(selectedCID, ["forwarded_mids", "forwarded_snapshots"]);
    } else if (repliedMessage) {
      dispatch(addExternalProps({ [repliedMessage.cid]: {} }));
      removeDraftWithOptions(repliedMessage.cid, "replied_mid");
    }
  };

  return repliedMessage || forwardedMessages.length || editedMessage ? (
    <AdditionalMessages
      type={editedMessage ? "edit" : repliedMessage ? "reply" : "forward"}
      message={editedMessage || repliedMessage}
      messages={forwardedMessages}
      isPreview={true}
      onCloseFunc={handleClose}
    />
  ) : null;
}
