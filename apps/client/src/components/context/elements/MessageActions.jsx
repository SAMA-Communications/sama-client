import { useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router";

import draftService from "@services/tools/draftService.js";
import messagesService from "@services/messagesService.js";

import { useConfirmWindow, ContextMenuItem } from "@sama-communications.ui-kit";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";

import { addSuffix, upsertMidsInPath } from "@utils/NavigationUtils.js";
import { writeToCanvas } from "@utils/MediaUtils.js";

import { ArrowDownToLine, CircleCheck, Copy, Forward, Reply, Trash, SquarePen, MessageCircleX } from "lucide-react";

export default function MessageActions({ listOfIds }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const confirmWindow = useConfirmWindow();

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
                  [blob.type]: [`.${attachment.file_content_type.split("/").pop()}`],
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
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
      } catch {}
    },
  };

  const links = {
    messageReply: (
      <ContextMenuItem
        key={"messageReply"}
        text="Reply"
        icon={<Reply size={18} />}
        onClick={() => {
          dispatch(
            addExternalProps({
              [selectedCID]: { draft_replied_mid: message._id },
            }),
          );
          draftService.saveDraft(selectedCID, { replied_mid: message._id });
        }}
      />
    ),
    messageSaveAs: (
      <ContextMenuItem
        key={"messageSaveAs"}
        text={`Save${window.showSaveFilePicker ? " As" : ""}`}
        icon={<ArrowDownToLine size={18} />}
        onClick={linksAction.messageSaveAs}
      />
    ),
    messageCopyText: (
      <ContextMenuItem
        key={"messageCopyText"}
        text="Copy Text"
        icon={<Copy size={18} />}
        onClick={() => {
          message?.body && navigator.clipboard.writeText(message.body);
        }}
      />
    ),
    messageCopyAttachment: (
      <ContextMenuItem
        key={"messageCopyAttachment"}
        text="Copy Media"
        icon={<Copy size={18} />}
        onClick={linksAction.messageCopyAttachment}
      />
    ),
    messageForward: (
      <ContextMenuItem
        key={"messageForward"}
        text="Forward"
        icon={<Forward size={18} />}
        onClick={() => {
          addSuffix(location.pathname + location.hash, `/forward?mids=[${message._id}]`);
        }}
      />
    ),
    messageEdit: (
      <ContextMenuItem
        key={"messageEdit"}
        text="Edit"
        icon={<SquarePen size={18} />}
        onClick={() => {
          dispatch(
            addExternalProps({
              [selectedCID]: { draft_edited_mid: message._id },
            }),
          );
          draftService.saveDraft(selectedCID, { edited_mid: message._id });
        }}
      />
    ),
    messageDelete: (
      <ContextMenuItem
        key={"messageDelete"}
        text="Delete"
        icon={<Trash size={18} />}
        onClick={async () => {
          const { isConfirm, data } = await confirmWindow({
            title: "Delete selected message?",
            icon: <MessageCircleX size={40} color="red" strokeWidth={2} />,
            confirmText: "Delete",
            cancelText: "Cancel",
            actions: [
              ({ data, setData }) => (
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.scope === "all"}
                    onChange={(e) => setData({ scope: e.target.checked ? "all" : "self" })}
                  />
                  <span>Delete for everyone</span>
                </label>
              ),
            ],
          });
          const { _id } = message;
          isConfirm && messagesService.sendMessageDelete(selectedCID, [_id], data.type || "self");
        }}
      />
    ),
    messageSelect: (
      <ContextMenuItem
        key={"messageSelect"}
        text="Select"
        icon={<CircleCheck size={18} />}
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

  return useMemo(() => listOfIds.map((linkId) => links[linkId]).filter(Boolean), [listOfIds]);
}
