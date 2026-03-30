import { useSelector } from "react-redux";

import DownloadManager from "@lib/downloadManager.js";
import {
  consumePreEditComposeText,
  getDraftRepliedMessageId,
  purgeDraft,
  removeDraftFields,
  saveDraft,
} from "@lib/draftsEngine.js";

import { useConfirmWindow } from "@sama-communications.ui-kit";

import messagesService from "@services/messagesService.js";
import aiService from "@services/tools/AIService.js";

import store from "@store/store.js";
import { addExternalProps } from "@store/values/ContextMenu.js";
import {
  removeChat,
  removeLastMessage,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations.js";
import { selectCurrentUserId } from "@store/values/CurrentUserId.js";
import {
  addMessage,
  removeMessage,
  selectActiveConversationMessages,
  selectMessagesEntities,
  upsertMessage,
} from "@store/values/Messages.js";
import { setSelectedConversation } from "@store/values/SelectedConversation.js";

import { showCustomAlert } from "@utils/GeneralUtils.js";
import { history } from "@utils/history.js";
import { navigateTo, removeAndNavigateLastSection } from "@utils/NavigationUtils.js";

export default function useMessages() {
  const { pathname, hash, search } = history.location;
  const url = pathname + hash + search;

  const currentUserId = useSelector(selectCurrentUserId);
  const messagesEntities = useSelector(selectMessagesEntities);
  const messages = useSelector(selectActiveConversationMessages);

  const confirm = useConfirmWindow();

  const _prepareAttachmentMetadata = (attachments, originalAttachments = []) =>
    attachments.map((file, i) => ({
      file_id: file.file_id,
      file_name: file.file_name,
      file_url: originalAttachments[i].file_url,
      file_blur_hash: originalAttachments[i]?.file_blur_hash,
      file_content_type: originalAttachments[i]?.file_content_type,
      file_width: originalAttachments[i]?.file_width,
      file_height: originalAttachments[i]?.file_height,
    }));

  const _createLocalMessage = ({ body, attachments = [], forwardedMessageId, repliedMessageId }) => {
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

  const _sendMessageToServer = async (mObject, originalAttachments = []) => {
    const serverMessage = await messagesService.sendMessage(mObject);
    const serverAttachments = mObject.attachments?.length
      ? _prepareAttachmentMetadata(mObject.attachments, originalAttachments)
      : [];
    store.dispatch(upsertMessage({ _id: serverMessage._id, attachments: serverAttachments }));
  };

  const _handleMessageError = async (e, cid, lastMsg, disableInput) => {
    showCustomAlert(e.message || "The server connection is unavailable.", "warning");
    store.dispatch(setLastMessageField({ cid, msg: messages[messages.length - 1] }));
    store.dispatch(removeLastMessage({ cid }));
    store.dispatch(removeMessage(lastMsg._id || lastMsg.mid));
    disableInput?.();

    if (e.status === 403) {
      store.dispatch(removeChat(cid));
      store.dispatch(setSelectedConversation({}));
      navigateTo("/");
    }
  };

  const _sendForwardMessages = async (
    forwardedMids,
    selectedCID,
    isSendMessageDisable,
    disableInput,
    enableInput,
    onSend,
  ) => {
    if (!store.getState().networkState.value) {
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
        disableInput?.();

        const localMsg = _createLocalMessage({
          body: message.body,
          attachments: message.attachments,
          forwardedMessageId: message._id,
        });

        lastMessage = localMsg;

        store.dispatch(addMessage(localMsg));
        if (isLast) store.dispatch(updateLastMessageField({ cid: selectedCID, msg: localMsg }));

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
            })),
          );
          mObject.attachments = files.map((att, i) => {
            const { file_url, _id, ...rest } = originalAttachments[i];
            const newAtt = { ...rest, ...att };
            delete newAtt.file_url;
            return newAtt;
          });
        }

        await _sendMessageToServer(mObject, originalAttachments);
      }
    } catch (err) {
      await _handleMessageError(err, selectedCID, lastMessage, disableInput);
      return;
    }

    removeDraftFields(forwardedMessages[0].cid, ["forwarded_mids"], { syncReduxNow: true });
    enableInput?.();
    purgeDraft(selectedCID);
    store.dispatch(addExternalProps({ [selectedCID]: {} }));
    onSend?.();
  };

  const deleteSelectedMessages = async (selectedCID, mids) => {
    const { isConfirm, data } = await confirm({
      title: `Delete selected message${mids.length > 1 ? "s" : ""}?`,
      confirmText: "Delete",
      cancelText: "Cancel",
      action: "messageDelete",
    });
    isConfirm && messagesService.sendMessageDelete(selectedCID, mids, data.type);
    removeAndNavigateLastSection(pathname + hash);
  };

  const getSelectedMessages = () => {
    const match = hash.match(/mids=\[([^\]]*)\]/);
    if (!match?.[1]) return null;
    const mids = match[1]
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    return {
      countOfSelectedMessages: mids.length,
      midsArrayOfSelectedMessages: mids,
    };
  };

  const summarizeMessages = async (selectedCID, filter) => {
    await aiService.summarizeMessages({ cid: selectedCID, filter });
  };

  const changeMessageTone = async (body, tone) => {
    return await aiService.changeMessageTone({ body, tone });
  };

  const createAndSendMessage = async (
    inputValue,
    selectedConversation,
    draftExtenralProps,
    isSendMessageDisable,
    disableInput,
    enableInput,
    onSend,
  ) => {
    if (!store.getState().networkState.value) {
      showCustomAlert("No internet connection…", "warning");

      return;
    }

    const selectedCID = selectedConversation._id;

    const forwardedMessages = selectedConversation.draft?.forwarded_mids;
    if (forwardedMessages) {
      await _sendForwardMessages(
        forwardedMessages,
        selectedCID,
        isSendMessageDisable,
        disableInput,
        enableInput,
        onSend,
      );
    }

    const body = inputValue;
    if (body.length === 0) return;

    disableInput?.();

    const repliedMid =
      draftExtenralProps[selectedCID]?.draft_replied_mid ||
      selectedConversation?.draft?.replied_mid ||
      getDraftRepliedMessageId(selectedCID);

    const msg = _createLocalMessage({ body, repliedMessageId: repliedMid });

    store.dispatch(addMessage(msg));
    store.dispatch(updateLastMessageField({ cid: selectedCID, msg }));

    const mObject = {
      mid: msg._id,
      body: msg.body,
      cid: selectedCID,
      from: currentUserId,
      ...(repliedMid && { replied_message_id: repliedMid }),
    };

    try {
      await _sendMessageToServer(mObject);
    } catch (e) {
      await _handleMessageError(e, selectedCID, msg);
      return body;
    }

    enableInput?.();
    purgeDraft(selectedCID);
    store.dispatch(addExternalProps({ [selectedCID]: {} }));
    onSend?.();
  };

  const editMessage = async (inputValue, selectedConversation, editedMessage) => {
    const selectedCID = selectedConversation._id;

    const eMid = editedMessage._id;
    if (!inputValue.length) {
      const { isConfirm } = await confirm({
        title: "Are you sure you want to delete the message?",
        confirmText: "Delete",
        cancelText: "Cancel",
      });
      if (isConfirm) {
        messagesService.sendMessageDelete(selectedCID, [eMid], "all");
        consumePreEditComposeText(selectedCID);
      }
      return;
    }
    if (editedMessage.body !== inputValue) {
      await messagesService.sendMessageEdit(editedMessage._id, {
        body: inputValue,
      });
    }
    store.dispatch(addExternalProps({ [selectedCID]: {} }));
    const restored = consumePreEditComposeText(selectedCID);
    removeDraftFields(selectedCID, ["edited_mid"], { syncReduxNow: false });
    saveDraft(selectedCID, { text: restored });
    return restored;
  };

  return {
    createAndSendMessage,
    editMessage,

    deleteSelectedMessages,
    getSelectedMessages,

    summarizeMessages,
    changeMessageTone,
  };
}
