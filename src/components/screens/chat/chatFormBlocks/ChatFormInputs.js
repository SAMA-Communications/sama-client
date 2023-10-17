import api from "../../../../api/api";
import AttachmentsList from "./../../../generic/AttachmentsList.js";
import isMobile from "./../../../../utils/get_device_type.js";
import jwtDecode from "jwt-decode";
import heicToPng from "../../../../utils/heic_to_png";
import { getFileObjects } from "../../../../api/download_manager";
import { getNetworkState } from "../../../../store/NetworkState";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { ReactComponent as Loading } from "./../../../../assets/icons/chatForm/Loading.svg";
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
  const [isLoadingFile, setIsLoadingFile] = useState(false);

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
          resaveLastMessageId: mid,
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
    messageInputEl.current.style.height = `40px`;
  };
  // ʌʌ  Send message block  ʌʌ //

  // vv  Attachments pick  vv //
  const pickUserFiles = () => filePicker.current.click();
  const handlerChange = async ({ target: { files: pickedFiles } }) => {
    console.log(pickedFiles);
    if (!pickedFiles.length) {
      return;
    }
    setIsLoadingFile(true);

    const selectedFiles = [];
    try {
      for (let i = 0; i < pickedFiles.length; i++) {
        const file = pickedFiles[i];
        if (file.name.length > 255) {
          throw new Error("The file name should not exceed 255 characters.", {
            cause: {
              message: "The file name should not exceed 255 characters.",
            },
          });
        }

        if (!file.type.startsWith("image/") && !/^\w+\.HEIC$/.test(file.name)) {
          throw new Error("Please select an image file.", {
            cause: { message: "Please select an image file." },
          });
        } else if (/^\w+\.HEIC$/.test(file.name)) {
          const pngFile = await heicToPng(file);
          selectedFiles.push(pngFile);
          continue;
        }

        selectedFiles.push(file);
      }

      if (files?.length + pickedFiles.length >= 10) {
        throw new Error("The maximum limit for file uploads is 10.", {
          cause: { message: "The maximum limit for file uploads is 10." },
        });
      }
    } catch (err) {
      err.cause
        ? showCustomAlert(err.cause.message, "warning")
        : console.error(err);
      setIsLoadingFile(false);
      return;
    }

    setFiles(files?.length ? [...files, ...selectedFiles] : [...selectedFiles]);
    messageInputEl.current.focus();
    setIsLoadingFile(false);
  };
  // ʌʌ  Attachments pick  ʌʌ //

  // vv  Input functions block  vv //
  useEffect(() => {
    messageInputEl.current.value = "";
    messageInputEl.current.style.height = `40px`;
  }, [selectedCID]);

  const handleInput = (e) => {
    if (messageInputEl.current) {
      const countOfEnter = e.target.value.split("\n").length - 1;
      messageInputEl.current.style.height = `${
        40 + countOfEnter * 16 < 230 ? 40 + countOfEnter * 16 : 230
      }px `;
      messageInputEl.current.scrollTop = messageInputEl.current.scrollHeight;
    }
  };

  const handeOnKeyDown = (e) => {
    if (
      e.keyCode === 13 &&
      ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
    ) {
      sendMessage(e);
    }
  };
  // ʌʌ  Input functions pick  ʌʌ //

  const fileView = useMemo(() => {
    if (isLoadingFile) {
      return (
        <div className="chat-files-preview">
          <Loading />
        </div>
      );
    }

    return files?.length ? (
      <div className="chat-files-preview">
        <AttachmentsList files={files} funcUpdateFile={setFiles} />
      </div>
    ) : null;
  }, [files, isLoadingFile]);

  return (
    <>
      {fileView}
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
          <textarea
            id="inputMessage"
            ref={messageInputEl}
            onTouchStart={(e) => !e.target.value.length && e.target.blur()}
            onInput={handleInput}
            onKeyDown={handeOnKeyDown}
            onBlur={handleInput}
            autoComplete="off"
            autoFocus={!isMobile}
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
