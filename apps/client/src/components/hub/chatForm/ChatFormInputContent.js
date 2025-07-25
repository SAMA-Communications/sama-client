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
  repliedMessage,
  forwardedMessages = [],
}) {
  const selectedCID = useSelector(getConverastionById)._id;
  const dispatch = useDispatch();

  const handleClose = () => {
    if (repliedMessage) {
      dispatch(addExternalProps({ [repliedMessage.cid]: {} }));
      draftService.removeDraftWithOptions(repliedMessage.cid, "replied_mid");
    } else if (forwardedMessages.length) {
      dispatch(
        removeDraftField({ cid: selectedCID, fields: ["forwarded_mids"] })
      );
    }
  };

  return (
    <AnimatePresence mode="exit">
      {(repliedMessage || forwardedMessages.length) && (
        <AdditionalMessages
          type={repliedMessage ? "reply" : "forward"}
          message={repliedMessage}
          messages={forwardedMessages}
          isPreview={true}
          onCloseFunc={handleClose}
        />
      )}
    </AnimatePresence>
  );
}
