import { AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";

import draftService from "@services/tools/draftService.js";

import AdditionalMessages from "@components/hub/elements/AdditionalMessages.js";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { removeDraftField } from "@store/values/Conversations.js";

export default function ChatFormInputContent({
  repliedMessage,
  forwardedMessages = [],
}) {
  const dispatch = useDispatch();

  const handleClose = () => {
    if (repliedMessage) {
      dispatch(addExternalProps({ [repliedMessage.cid]: {} }));
      draftService.removeDraftWithOptions(repliedMessage.cid, "replied_mid");
    } else if (forwardedMessages.length) {
      dispatch(
        removeDraftField({
          cid: forwardedMessages[0].cid,
          fields: ["forwarded_mids"],
        })
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
