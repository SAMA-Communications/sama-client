import { AnimatePresence } from "motion/react";
import { useDispatch, useSelector } from "react-redux";

import draftService from "@services/tools/draftService.js";

import AdditionalMessages from "@components/hub/elements/AdditionalMessages.js";

import {
  removeDraftField,
  getConverastionById,
} from "@store/values/Conversations.js";
import { addExternalProps } from "@store/values/ContextMenu.js";

export default function ChatFormInputContent({
  editedMessage,
  repliedMessage,
  forwardedMessages = [],
}) {
  const selectedCID = useSelector(getConverastionById)._id;
  const dispatch = useDispatch();

  const handleClose = () => {
    if (editedMessage) {
      dispatch(addExternalProps({ [editedMessage.cid]: {} }));
      draftService.removeDraftWithOptions(editedMessage.cid, "edited_mid");
    if (repliedMessage) {
      dispatch(addExternalProps({ [repliedMessage.cid]: {} }));
      draftService.removeDraftWithOptions(repliedMessage.cid, "replied_mid");
    } else if (forwardedMessages.length) {
      dispatch(
        removeDraftField({ cid: selectedCID, fields: ["forwarded_mids"] })
      );
    } else if (repliedMessage) {
      dispatch(addExternalProps({ [repliedMessage.cid]: {} }));
      draftService.removeDraftWithOptions(repliedMessage.cid, "replied_mid");
    }
  };

  return (
    <AnimatePresence mode="exit">
      {(repliedMessage || forwardedMessages.length || editedMessage) && (
        <AdditionalMessages
          type={editedMessage ? "edit" : repliedMessage ? "reply" : "forward"}
          message={editedMessage || repliedMessage}
          messages={forwardedMessages}
          isPreview={true}
          onCloseFunc={handleClose}
        />
      )}
    </AnimatePresence>
  );
}
