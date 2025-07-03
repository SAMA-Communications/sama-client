import { AnimatePresence } from "motion/react";
import { useDispatch } from "react-redux";

import draftService from "@services/tools/draftService.js";

import RepliedMessage from "@components/hub/elements/RepliedMessage.js";

import { addExternalProps } from "@store/values/ContextMenu.js";

export default function ChatFormInputContent({ message }) {
  const dispatch = useDispatch();

  return (
    <AnimatePresence mode="exit">
      {message ? (
        <RepliedMessage
          message={message}
          isPreview={true}
          onCloseFunc={() => {
            dispatch(addExternalProps({ [message.cid]: {} }));
            draftService.removeDraftWithOptions(message.cid, "replied_mid");
          }}
        />
      ) : null}
    </AnimatePresence>
  );
}
