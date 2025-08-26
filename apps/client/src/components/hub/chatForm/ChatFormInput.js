import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import draftService from "@services/tools/draftService.js";
import messagesService from "@services/messagesService";
import DownloadManager from "../../../lib/downloadManager.js";

import MessageInput from "@components/hub/elements/MessageInput";

import {
  addMessage,
  removeMessage,
  upsertMessage,
  selectMessagesEntities,
  selectActiveConversationMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  removeChat,
  removeLastMessage,
  removeDraftField,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import {
  addExternalProps,
  selectContextExternalProps,
} from "@store/values/ContextMenu.js";
import { getNetworkState } from "@store/values/NetworkState";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";

import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import calcInputHeight from "@utils/text/calc_input_height.js";

export default function ChatFormInput({ chatMessagesBlockRef, editedMessage }) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const currentUserId = useSelector(selectCurrentUserId);
  const messagesEntities = useSelector(selectMessagesEntities);
  const messages = useSelector(selectActiveConversationMessages);
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;
  const draftExtenralProps = useSelector(selectContextExternalProps);

  const inputRef = useRef(null);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  window.onresize = function () {
    if (inputRef.current) {
      inputRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  const createLocalMessage = ({
    body,
    attachments = [],
    forwardedMessageId,
    repliedMessageId,
  }) => {
    const mid = currentUserId + Date.now();
    return {
      _id: mid,
      body,
      attachments,
      from: currentUserId,
      t: Date.now(),
      ...(forwardedMessageId && { forwarded_message_id: forwardedMessageId }),
      ...(repliedMessageId && { replied_message_id: repliedMessageId }),
    };
  };

  const prepareAttachmentMetadata = (attachments, originalAttachments = []) =>
    attachments.map((file, i) => ({
      file_id: file.file_id,
      file_name: file.file_name,
      file_url: originalAttachments[i].file_url,
      file_blur_hash: originalAttachments[i]?.file_blur_hash,
      file_content_type: originalAttachments[i]?.file_content_type,
      file_width: originalAttachments[i]?.file_width,
      file_height: originalAttachments[i]?.file_height,
    }));

  const sendMessageToServer = async (mObject, originalAttachments = []) => {
    const serverMessage = await messagesService.sendMessage(mObject);
    const serverAttachments = mObject.attachments?.length
      ? prepareAttachmentMetadata(mObject.attachments, originalAttachments)
      : [];
    dispatch(
      upsertMessage({ _id: serverMessage._id, attachments: serverAttachments })
    );
  };

  const handleError = async (e, cid, lastMsg) => {
    showCustomAlert(
      e.message || "The server connection is unavailable.",
      "warning"
    );
    dispatch(setLastMessageField({ cid, msg: messages[messages.length - 1] }));
    dispatch(removeLastMessage({ cid }));
    dispatch(removeMessage(lastMsg._id || lastMsg.mid));
    setIsSendMessageDisable(false);

    if (e.status === 403) {
      dispatch(removeChat(cid));
      dispatch(setSelectedConversation({}));
      navigateTo("/");
    }
  };

  const sendForwardMessages = async (forwardedMids) => {
    if (!connectState) {
      showCustomAlert("No internet connection…", "warning");
      return;
    }

    const forwardedMessages = forwardedMids.map((mid) => messagesEntities[mid]);
    if (!forwardedMessages.length) return;

    let lastMessage = null;

    try {
      for (let i = 0; i < forwardedMessages.length; i++) {
        const message = forwardedMessages[i];
        const isLast = i === forwardedMessages.length - 1;

        if (isSendMessageDisable) return;
        setIsSendMessageDisable(true);

        const localMsg = createLocalMessage({
          body: message.body,
          attachments: message.attachments,
          forwardedMessageId: message._id,
        });

        lastMessage = localMsg;

        dispatch(addMessage(localMsg));
        if (isLast)
          dispatch(updateLastMessageField({ cid: selectedCID, msg: localMsg }));

        const mObject = {
          mid: localMsg._id,
          body: localMsg.body,
          cid: selectedCID,
          from: currentUserId,
          forwarded_message_id: message._id,
        };

        let originalAttachments = message.attachments;
        if (message.attachments?.length) {
          const files = await DownloadManager.getFileObjectsFromUrls(
            message.attachments.map((att) => ({
              url: att.file_url,
              fileName: att.file_name,
              contentType: att.file_content_type,
            }))
          );
          mObject.attachments = files.map((att, i) => {
            const { file_url, _id, ...rest } = originalAttachments[i];
            const newAtt = { ...rest, ...att };
            delete newAtt.file_url;
            return newAtt;
          });
        }

        await sendMessageToServer(mObject, originalAttachments);
      }
    } catch (err) {
      await handleError(err, selectedCID, lastMessage);
      return;
    }

    dispatch(
      removeDraftField({
        cid: forwardedMessages[0].cid,
        fields: ["forwarded_mids"],
      })
    );
    setIsSendMessageDisable(false);
    draftService.removeDraft(selectedCID);
    dispatch(addExternalProps({ [selectedCID]: {} }));
    chatMessagesBlockRef.current.scrollTop =
      chatMessagesBlockRef.current.scrollHeight;
  };

  const createAndSendMessage = async () => {
    if (!connectState) {
      showCustomAlert("No internet connection…", "warning");
      return;
    }

    const forwardedMessages = selectedConversation.draft?.forwarded_mids;
    if (forwardedMessages) {
      await sendForwardMessages(forwardedMessages);
    }

    const body = inputRef.current.value.trim();
    if (body.length === 0 || isSendMessageDisable) return;

    setIsSendMessageDisable(true);
    inputRef.current.value = "";

    const repliedMid =
      draftExtenralProps[selectedCID]?.draft_replied_mid ||
      selectedConversation?.draft?.replied_mid;

    const msg = createLocalMessage({ body, repliedMessageId: repliedMid });

    dispatch(addMessage(msg));
    dispatch(updateLastMessageField({ cid: selectedCID, msg }));
    setTimeout(() => inputRef.current.focus(), 50);

    const mObject = {
      mid: msg._id,
      body: msg.body,
      cid: selectedCID,
      from: currentUserId,
      ...(repliedMid && { replied_message_id: repliedMid }),
    };

    try {
      await sendMessageToServer(mObject);
    } catch (e) {
      await handleError(e, selectedCID, msg);
      inputRef.current.value = body;
      return;
    }

    setIsSendMessageDisable(false);
    draftService.removeDraft(selectedCID);
    dispatch(addExternalProps({ [selectedCID]: {} }));
    chatMessagesBlockRef.current.scrollTop =
      chatMessagesBlockRef.current.scrollHeight;
    inputRef.current.style.height = `55px`;
  };

  const editMessageFunc = async () => {
    if (!inputRef.current.value.trim().length) {
      showCustomAlert("Message cann't be empty", "warning");
      //delete message
      return;
    }
    await messagesService.sendEditMessage(editedMessage._id, {
      body: inputRef.current.value,
    });
    dispatch(addExternalProps({ [selectedCID]: {} }));
    draftService.removeDraftWithOptions(selectedCID, "edited_mid");
  };

  useEffect(() => {
    if (editedMessage) {
      inputRef.current.value &&
        draftService.saveLastInputText(selectedCID, inputRef.current.value);
      draftService.saveDraft(selectedCID, { text: editedMessage.body });
      inputRef.current.value = editedMessage.body;
    } else {
      inputRef.current.value = draftService.getLastInputText(selectedCID);
      draftService.saveDraft(selectedCID, { text: inputRef.current.value });
    }
  }, [editedMessage]);

  useEffect(() => {
    if (inputRef.current) {
      const draftText = draftService.getDraftMessage(selectedCID) || "";
      inputRef.current.value = draftText;
      inputRef.current.style.height = `${calcInputHeight(draftText)}px`;
    }
  }, [selectedCID]);

  useEffect(() => {
    draftExtenralProps[selectedCID]?.draft_replied_mid &&
      inputRef.current.focus();
  }, [draftExtenralProps]);

  const isBlockedConv = useMemo(() => {
    const { type, owner_id, opponent_id } = selectedConversation;

    return (
      type === "u" &&
      (!participants[opponent_id]?.login || !participants[owner_id]?.login)
    );
  }, [selectedConversation, participants]);

  return (
    <MessageInput
      inputTextRef={inputRef}
      isBlockedConv={isBlockedConv}
      isEditAction={!!editedMessage}
      isSending={isSendMessageDisable}
      onSubmitFunc={editedMessage ? editMessageFunc : createAndSendMessage}
      chatMessagesBlockRef={chatMessagesBlockRef}
    />
  );
}
