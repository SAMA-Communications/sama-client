import { AnimatePresence } from "motion/react";

import draftService from "@services/draftService.js";

import RepliedMessage from "@components/hub/elements/RepliedMessage.js";

export default function ChatFormInputContent({ message }) {
  return (
    <AnimatePresence mode="exit">
      {message ? (
        <RepliedMessage
          message={message}
          isPreview={true}
          onCloseFunc={() =>
            draftService.removeDraftWithOptions(message.cid, "replied_mid")
          }
        />
      ) : null}
    </AnimatePresence>
  );
}
