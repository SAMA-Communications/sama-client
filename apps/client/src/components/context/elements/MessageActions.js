import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";

import draftService from "@services/tools/draftService.js";
import messagesService from "@services/messagesService.js";

import ContextLink from "@components/context/elements/ContextLink";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";

import addSuffix from "@utils/navigation/add_suffix.js";
import upsertMidsInPath from "@utils/navigation/upasert_mids_in_path.js";
import writeToCanvas from "@utils/media/write_to_canvas.js";

import Reply from "@icons/context/Reply.svg?react";
import Edit from "@icons/context/EditText.svg?react";
import Copy from "@icons/context/Copy.svg?react";
import Forward from "@icons/context/Forward.svg?react";
import Select from "@icons/context/Select.svg?react";
import Download from "@icons/context/Download.svg?react";
import Delete from "@icons/context/Delete.svg?react";

export default function MessageActions({ listOfIds }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const selectedCID = useSelector(getSelectedConversationId);

  const { message, attachment } = useSelector(selectContextExternalProps);

  const linksAction = {
    messageSaveAs: async () => {
      if (!attachment?.file_url) return;
      try {
        const response = await fetch(attachment.file_url);
        const blob = await response.blob();
        if (window.showSaveFilePicker) {
          const fileHandle = await window.showSaveFilePicker({
            suggestedName: attachment.file_name || attachment.file_id,
            types: [
              {
                description: "All Files",
                accept: {
                  [blob.type]: [
                    `.${attachment.file_content_type.split("/").pop()}`,
                  ],
                },
              },
            ],
          });
          const writable = await fileHandle.createWritable();
          await writable.write(blob);
          await writable.close();
        } else {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = attachment.file_name || "file";
          a.click();
          URL.revokeObjectURL(url);
        }
      } catch {}
    },
    messageCopyAttachment: async () => {
      if (!attachment.file_url) return;
      try {
        const blob = await writeToCanvas(attachment.file_url);
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob }),
        ]);
      } catch {}
    },
  };

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
        text={`Save${window.showSaveFilePicker ? " As" : ""}`}
        icon={<Download />}
        onClick={linksAction.messageSaveAs}
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
        onClick={linksAction.messageCopyAttachment}
      />
    ),
    messageForward: (
      <ContextLink
        key={"messageForward"}
        text="Forward"
        icon={<Forward />}
        onClick={() => {
          addSuffix(
            location.pathname + location.hash,
            `/forward?mids=[${message._id}]`
          );
        }}
      />
    ),
    messageEdit: (
      <ContextLink
        key={"messageEdit"}
        text="Edit"
        icon={<Edit />}
        onClick={() => {
          dispatch(
            addExternalProps({
              [selectedCID]: { draft_edited_mid: message._id },
            })
          );
          draftService.saveDraft(selectedCID, { edited_mid: message._id });
        }}
      />
    ),
    messageDelete: (
      <ContextLink
        key={"messageDelete"}
        text="Delete"
        icon={<Delete />}
        onClick={() => {
          const isComfirm = confirm("Are you shure to delete message?");
          const { _id, cid } = message;
          isComfirm && messagesService.sendMessageDelete(cid, [_id], "all");
        }}
      />
    ),
    messageSelect: (
      <ContextLink
        key={"messageSelect"}
        text="Select"
        icon={<Select />}
        onClick={() => {
          const isSelected = location.hash.includes("selection");
          const currentPath = location.pathname + location.hash;
          isSelected
            ? upsertMidsInPath(currentPath, [message._id], "add")
            : addSuffix(currentPath, `/selection?mids=[${message._id}]`);
        }}
      />
    ),
  };

  return useMemo(
    () => listOfIds.map((linkId) => links[linkId]).filter(Boolean),
    [listOfIds]
  );
}
