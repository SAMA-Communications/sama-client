import { useMemo } from "react";

import { useLocation } from "react-router";

import { useSelector, useDispatch } from "react-redux";

import {
  ArrowDownToLine,
  CircleCheck,
  Copy,
  Forward,
  Reply,
  Trash,
  SquarePen,
  MessageCircleX,
  CheckCheck,
  PenTool,
} from "lucide-react";

import { useConfirmWindow, ContextMenuItem } from "@sama-communications.ui-kit";

import messagesService from "@services/messagesService.js";
import draftService from "@services/tools/draftService.js";

import { formatEpochMs, messageEpochMs } from "@src/utils/MessageUtils";

import { addExternalProps } from "@store/values/ContextMenu.js";
import { selectContextExternalProps } from "@store/values/ContextMenu.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";

import { MESSAGE_META_TIME } from "@utils/constants";
import { writeToCanvas } from "@utils/MediaUtils.js";
import { addSuffix, upsertMidsInPath } from "@utils/NavigationUtils.js";

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
                <label className="flex items-center justify-center gap-2">
                  <input
                    type="checkbox"
                    checked={data.type === "all"}
                    onChange={(e) => setData({ type: e.target.checked ? "all" : "myself" })}
                  />
                  <span>Delete for everyone</span>
                </label>
              ),
            ],
          });
          const { _id } = message;
          isConfirm && messagesService.sendMessageDelete(selectedCID, [_id], data.type || "myself");
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
    messageMetaEditedAt: (
      <ContextMenuItem
        key="messageMetaEditedAt"
        text={`Edited at: ${formatEpochMs(messageEpochMs(message, "updated"), MESSAGE_META_TIME)}`}
        className="text-text-dark/60 mt-1 cursor-default text-sm"
        icon={<PenTool size={16} />}
        additionalContent={<hr className="ui:mt-auto ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />}
        onClick={() => {}}
      />
    ),
    messageMetaSentAt: (
      <ContextMenuItem
        key="messageMetaSentAt"
        text={`Sent at: ${formatEpochMs(messageEpochMs(message, "sent"), MESSAGE_META_TIME)}`}
        className="text-text-dark/60 -mt-2 cursor-default text-sm"
        icon={<CheckCheck size={16} />}
        onClick={() => {}}
      />
    ),
  };

  return useMemo(() => listOfIds.map((linkId) => links[linkId]).filter(Boolean), [listOfIds, message, attachment]);
}
