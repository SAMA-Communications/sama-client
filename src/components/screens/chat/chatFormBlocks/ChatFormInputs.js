import api from "../../../../api/api";
import AttachmentsList from "./../../../generic/AttachmentsList.js";
import isMobile from "./../../../../utils/get_device_type.js";
import jwtDecode from "jwt-decode";
import { getFileObjects } from "../../../../api/download_manager";
import { getNetworkState } from "../../../../store/NetworkState";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addMessage,
  getActiveConversationMessages,
  removeMessage,
} from "../../../../store/Messages";
import showCustomAlert from "../../../../utils/show_alert";
import {
  getConverastionById,
  setLastMessageField,
  updateLastMessageField,
} from "../../../../store/Conversations";

import { ReactComponent as SendFilesButton } from "./../../../../assets/icons/chatForm/SendFilesButton.svg";
import { ReactComponent as SendMessageButton } from "./../../../../assets/icons/chatForm/SendMessageButton.svg";

export default function ChatFormInputs({
  chatMessagesBlockRef,
  messageInputEl,
  files,
  setFiles,
}) {
  const dispatch = useDispatch();

  const connectState = useSelector(getNetworkState);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const messages = useSelector(getActiveConversationMessages);
  const filePicker = useRef(null);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  const scrollChatToBottom = () =>
    chatMessagesBlockRef.current?._infScroll?.scrollIntoView({ block: "end" });

  // vv  Send message block  vv //
  const sendMessage = async (event) => {
    event.preventDefault();

    if (!connectState) {
      showCustomAlert("No internet connection…", "warning");
      return;
    }

    const text = messageInputEl.current.value.trim();
    if ((text.length === 0 && !files?.length) || isSendMessageDisable) {
      return;
    }
    setIsSendMessageDisable(true);
    messageInputEl.current.value = "";
    const mid = userInfo._id + Date.now();
    let msg = {
      _id: mid,
      body: text,
      from: userInfo._id,
      t: Date.now(),
    };

    dispatch(addMessage(msg));
    dispatch(updateLastMessageField({ cid: selectedCID, msg }));

    let attachments = [];
    const reqData = {
      mid,
      text: text,
      chatId: selectedCID,
    };

    if (files?.length) {
      attachments = await getFileObjects(files);
      reqData["attachments"] = attachments.map((obj) => {
        return { file_id: obj.file_id, file_name: obj.file_name };
      });
    }

    let response;
    try {
      response = await api.messageCreate(reqData);
    } catch (err) {
      showCustomAlert("The server connection is unavailable.", "warning");
      dispatch(
        setLastMessageField({
          cid: selectedCID,
          msg: messages[messages.length - 1],
        })
      );
      return;
    }

    if (response.mid) {
      msg = {
        _id: response.server_mid,
        body: text,
        from: userInfo._id,
        status: "sent",
        t: response.t,
        attachments,
      };

      dispatch(addMessage(msg));
      dispatch(
        updateLastMessageField({
          cid: selectedCID,
          resaveLastMessage: 1,
          msg,
        })
      );
      dispatch(removeMessage(mid));
    }
    setFiles([]);
    filePicker.current.value = "";
    isMobile && messageInputEl.current.blur();

    setIsSendMessageDisable(false);
    scrollChatToBottom();
    messageInputEl.current.focus();
  };
  // ʌʌ  Send message block  ʌʌ //

  // vv  Attachments pick  vv //
  const pickUserFiles = () => filePicker.current.click();
  const handlerChange = (event) => {
    if (!event.target.files.length) {
      return;
    }

    const selectedFiles = [];
    for (const file of event.target.files) {
      if (file.name.length > 255) {
        showCustomAlert(
          "The file name should not exceed 255 characters.",
          "warning"
        );
        return;
      }
      if (!file.type.startsWith("image/")) {
        showCustomAlert("Please select an image file.", "warning");
        return;
      }

      selectedFiles.push(file);
    }

    if (files?.length + event.target.files.length >= 10) {
      showCustomAlert("The maximum limit for file uploads is 10.", "warning");
      return;
    }

    setFiles(files?.length ? [...files, ...selectedFiles] : [...selectedFiles]);
    messageInputEl.current.focus();
  };
  // ʌʌ  Attachments pick  ʌʌ //

  return (
    <>
      {files?.length ? (
        <AttachmentsList files={files} funcUpdateFile={setFiles} />
      ) : null}
      <form id="chat-form-send" action="">
        <div className="form-send-file">
          <SendFilesButton onClick={pickUserFiles} />
          <input
            id="inputFile"
            ref={filePicker}
            onChange={handlerChange}
            type="file"
            accept="image/*"
            multiple
          />
        </div>
        <div className="form-send-text">
          <input
            id="inputMessage"
            autoFocus={!isMobile}
            ref={messageInputEl}
            onTouchStart={(e) => e.target.blur()}
            autoComplete="off"
            placeholder="> Please type your message..."
          />
          <button id="send-message" onClick={sendMessage}>
            <SendMessageButton />
          </button>
        </div>
      </form>
    </>
  );
}
