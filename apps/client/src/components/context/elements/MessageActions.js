import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";

import draftService from "@services/tools/draftService.js";

import ContextLink from "@components/context/elements/ContextLink";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";

import Reply from "@icons/context/Reply.svg?react";
import Copy from "@icons/context/Copy.svg?react";
import Forward from "@icons/context/Forward.svg?react";
import Select from "@icons/context/Select.svg?react";
import Download from "@icons/context/Download.svg?react";

export default function MessageActions({ listOfIds }) {
  const dispatch = useDispatch();

  const selectedCID = useSelector(getSelectedConversationId);

  const { message, attachment } = useSelector(selectContextExternalProps);

  const links = {
    messageReply: (
      <ContextLink
        key={"messageReply"}
        text="Reply"
        icon={<Reply />}
        onClick={() => {
          dispatch(
            addExternalProps({
              [selectedCID]: { draft_replied_mid: message._id },
            })
          );
          draftService.saveDraft(selectedCID, { replied_mid: message._id });
        }}
      />
    ),
    messageSaveAs: (
      <ContextLink
        key={"messageSaveAs"}
        text="Save As"
        icon={<Download />}
        onClick={async () => {
          if (!attachment?.file_url) return;
          try {
            const response = await fetch(attachment.file_url);
            const blob = await response.blob();
            const fileHandle = await window.showSaveFilePicker({
              suggestedName: attachment.file_name || attachment.file_id,
              types: [
                {
                  description: "All Files",
                  accept: {
                    [blob.type]: [`.${attachment.file_url.split(".").pop()}`],
                  },
                },
              ],
            });
            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch {}
        }}
      />
    ),
    messageCopyText: (
      <ContextLink
        key={"messageCopyText"}
        text="Copy Text"
        icon={<Copy />}
        onClick={() => {
          message?.body && navigator.clipboard.writeText(message.body);
        }}
      />
    ),
    messageCopyAttachment: (
      <ContextLink
        key={"messageCopyAttachment"}
        text="Copy Media"
        icon={<Copy />}
        onClick={async () => {
          if (!attachment.url) return;
          try {
            const response = await fetch(attachment.url);
            const blob = await response.blob();
            await navigator.clipboard.write([
              new ClipboardItem({ [blob.type]: blob }),
            ]);
          } catch {}
        }}
      />
    ),
    messageForward: (
      <ContextLink
        key={"messageForward"}
        text="Forward"
        icon={<Forward />}
        onClick={() => {}}
      />
    ),
    messageSelect: (
      <ContextLink
        key={"messageSelect"}
        text="Select"
        icon={<Select />}
        onClick={() => {}}
      />
    ),
  };

  return useMemo(
    () => listOfIds.map((linkId) => links[linkId]).filter(Boolean),
    [listOfIds]
  );
}
