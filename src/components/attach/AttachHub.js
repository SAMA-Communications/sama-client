import AttachmentItem from "@components/attach/components/AttachmentItem";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import DownloadManager from "@src/adapters/downloadManager";
import OvalLoader from "@components/_helpers/OvalLoader";
import TextAreaInput from "@components/hub/elements/TextAreaInput";
import api from "@api/api";
import globalConstants from "@helpers/constants";
import processFile from "@src/utils/media/process_file";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@helpers/keyCodes";
import {
  addMessage,
  removeMessage,
  selectAllMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { getIsMobileView } from "@store/values/IsMobileView";
import { getNetworkState } from "@store/values/NetworkState";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";

import "@styles/attach/AttachHub.css";

export default function AttachHub() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const connectState = useSelector(getNetworkState);
  const isMobile = useSelector(getIsMobileView);

  const messages = useSelector(selectAllMessages);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation._id;
  const currentUser = useSelector(selectCurrentUser);

  const [isPending, setIsPending] = useState(false);
  const [isSendMessageDisable, setIsSendMessageDisable] = useState(false);

  const inputFilesRef = useRef(null);
  const inputTextRef = useRef(null);

  const [files, setFiles] = useState([]);

  const addFiles = async (newFiles) => {
    if (!newFiles.length) {
      return;
    }

    setIsPending(true);

    const selectedFiles = [];
    try {
      if (files?.length + newFiles.length > 10) {
        setIsPending(false);
        throw new Error("The maximum limit for file uploads is 10.", {
          message: "The maximum limit for file uploads is 10.",
        });
      }

      for (let i = 0; i < newFiles.length; i++) {
        selectedFiles.push(await processFile(newFiles[i]));
      }
    } catch (err) {
      err.message
        ? showCustomAlert(err.message, "warning")
        : console.error(err);
      setIsPending(false);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setIsPending(false);
  };

  const storeInputText = () => {
    if (inputTextRef.current?.value) {
      localStorage.setItem("mtext", inputTextRef.current.value);
      inputTextRef.current.value = "";
    }
  };

  const syncInputText = () => {
    const mtext = localStorage.getItem("mtext");
    if (mtext) {
      localStorage.removeItem("mtext");
      inputTextRef.current.value = mtext;
    }
  };

  const closeModal = useCallback(
    (isForseClose) => {
      const close = () => {
        removeAndNavigateLastSection(pathname + hash);
        storeInputText();
        return true;
      };

      if (isForseClose === true) {
        return close();
      }

      if (
        files.length &&
        !window.confirm("Are you sure you want to cancel sending files?")
      ) {
        return false;
      }
      return close();
    },
    [files.length, pathname, hash]
  );

  const removeFile = (index) => {
    if (files.length === 1 && !closeModal()) {
      return;
    }
    setFiles((prevFiles) =>
      prevFiles.slice(0, index).concat(prevFiles.slice(index + 1))
    );
  };

  const attachListView = useMemo(() => {
    if (isPending) {
      return <OvalLoader width={80} height={80} />;
    }

    if (!files.length) {
      return <p className="attach-input__alt">Select files</p>;
    }

    return files.map((file, index) => {
      return (
        <AttachmentItem
          key={index}
          file={{
            ...file,
            file_name: file.name,
            size: (file.size / 1000000).toFixed(2),
          }}
          isOnClickDisabled={true}
          removeFileFunc={() => removeFile(index)}
          url={file.localUrl}
        />
      );
    });
  }, [files, isPending]);

  const sendMessage = useCallback(
    async (event) => {
      event?.preventDefault();

      if (!connectState) {
        showCustomAlert("No internet connection…", "warning");
        return;
      }

      const body = inputTextRef.current.value.trim();
      if ((body.length === 0 && !files) || isSendMessageDisable) {
        return;
      }
      setIsSendMessageDisable(true);
      setIsPending(true);

      inputTextRef.current.value = "";
      const cid = selectedCID;
      const mid = currentUser._id + Date.now();

      let msg = {
        _id: mid,
        body,
        from: currentUser._id,
        t: Date.now(),
        attachments: files.map((file) => ({
          file_id: file.name,
          file_name: file.name,
          file_url: file.localUrl,
        })),
      };

      dispatch(addMessage(msg));
      dispatch(updateLastMessageField({ cid, msg }));

      let attachments = [];
      const reqData = { mid, body, cid };

      if (files?.length) {
        attachments = await DownloadManager.getFileObjects(files);
        reqData["attachments"] = attachments.map((obj, i) => ({
          file_id: obj.file_id,
          file_name: obj.file_name,
          file_blur_hash: files[i].blurHash,
        }));
      }

      let response;
      try {
        response = await api.messageCreate(reqData);
      } catch (err) {
        showCustomAlert("The server connection is unavailable.", "warning");
        dispatch(
          setLastMessageField({ cid, msg: messages[messages.length - 1] })
        );
        return;
      }

      if (response.mid) {
        msg = {
          _id: response.server_mid,
          body,
          from: currentUser._id,
          status: "sent",
          t: response.t,
          attachments: attachments.map((obj, i) => ({
            file_id: obj.file_id,
            file_name: obj.file_name,
            file_url: obj.file_url,
            file_local_url: files[i].localUrl,
            file_blur_hash: files[i].blurHash,
          })),
        };

        dispatch(addMessage(msg));
        dispatch(
          updateLastMessageField({ cid, resaveLastMessageId: mid, msg })
        );
        dispatch(removeMessage(mid));
      }

      setIsSendMessageDisable(false);
      setIsPending(false);
      closeModal(true);
    },
    [
      closeModal,
      connectState,
      currentUser,
      files,
      isSendMessageDisable,
      messages,
      selectedCID,
    ]
  );

  const handeOnKeyDown = useCallback(
    (e) => {
      if (
        e.keyCode === KEY_CODES.ENTER &&
        ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
      ) {
        e.preventDefault();
        sendMessage();
      }
    },
    [isMobile, sendMessage]
  );

  const handleInput = (e) => {
    if (inputTextRef.current) {
      const countOfLines = e.target.value.split("\n").length - 1;
      inputTextRef.current.style.height = `calc(${
        40 + countOfLines * 20 < 230 ? 40 + countOfLines * 20 : 215
      }px * var(--base-scale)) `;
      inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
    }
  };

  const pickFileClick = () => inputFilesRef.current.click();

  useEffect(() => {
    pickFileClick();
    syncInputText();
  }, []);

  useKeyDown(KEY_CODES.ESCAPE, closeModal);
  useKeyDown(
    KEY_CODES.ENTER,
    (e) =>
      ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey)) && sendMessage()
  );

  return (
    <>
      <input
        id="inputFile"
        ref={inputFilesRef}
        type="file"
        onChange={(e) => addFiles(Array.from(e.target.files))}
        accept={globalConstants.allowedFileFormats}
        multiple
      />
      <div className="attach-window__container fcc">
        <div className="attach-modal__content">
          <p className="attach-modal__title">
            {files.length > 1
              ? `Selected ${files.length} files`
              : "Send attachment"}
          </p>
          <CustomScrollBar
            customId={"attach-view__container"}
            autoHeight={true}
            autoHeightMax={460}
          >
            {attachListView}
          </CustomScrollBar>
          <TextAreaInput
            customId="attach-inputs__message"
            inputRef={inputTextRef}
            handleInput={handleInput}
            handeOnKeyDown={handeOnKeyDown}
            isDisabled={isSendMessageDisable}
            // isMobile={isMobile}
            placeholder={
              isSendMessageDisable
                ? "Processing and sending files..."
                : "Type your message..."
            }
          />
          {isSendMessageDisable ? null : (
            <div className="attach-navigation__container fcc">
              <p className="attach-navigation__link" onClick={pickFileClick}>
                Add
              </p>
              <p className="attach-navigation__link" onClick={closeModal}>
                Cancel
              </p>

              <p className="attach-navigation__link" onClick={sendMessage}>
                Send
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
