import localforage from "localforage";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";

import draftService from "@services/tools/draftService.js";
import messagesService from "@services/messagesService.js";

import DownloadManager from "@lib/downloadManager";
import { useKeyDown } from "@hooks/useKeyDown";

import MediaAttachments from "@components/message/elements/MediaAttachments.js";
import OvalLoader from "@components/_helpers/OvalLoader";
import TextAreaInput from "@components/hub/elements/TextAreaInput";

import { getNetworkState } from "@store/values/NetworkState";
import {
  addMessage,
  upsertMessage,
  selectAllMessages,
} from "@store/values/Messages";
import {
  getConverastionById,
  setLastMessageField,
  updateLastMessageField,
} from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { getIsMobileView } from "@store/values/IsMobileView";

import { processFile, extractFilesFromClipboard } from "@utils/MediaUtils.js";
import { removeAndNavigateLastSection } from "@utils/NavigationUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { KEY_CODES, ALLOWED_FILE_FORMATS } from "@utils/constants.js";

export default function AttachHub() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const connectState = useSelector(getNetworkState);
  const isMobile = useSelector(getIsMobileView);

  const messages = useSelector(selectAllMessages);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation._id;
  const currentUserId = useSelector(selectCurrentUserId);

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
      draftService.saveDraft(selectedCID, { text: inputTextRef.current.value });
      inputTextRef.current.value = "";
    }
  };

  const syncInputText = () => {
    const messageBody = draftService.getDraftMessage(selectedCID);
    messageBody && (inputTextRef.current.value = messageBody);
  };

  const closeModal = useCallback(
    (isForseClose) => {
      const close = () => {
        removeAndNavigateLastSection(pathname + hash);
        localforage.removeItem("attachFiles");
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
      return (
        <OvalLoader width={80} height={80} customClassName="self-center" />
      );
    }

    if (!files.length) {
      return <p className="py-[10px] text-h5 self-center">Select files</p>;
    }

    return (
      <MediaAttachments
        maxHeight={"min(460px, calc(100svh - 300px))"}
        attachments={files.map((file) => {
          return {
            file_name: file.name,
            file_url: file.localUrl,
            file_blur_hash: file.blurHash,
            file_size: (file.size / 1000000).toFixed(2),
            file_content_type: file.type,
            file_width: file.width,
            file_height: file.height,
          };
        })}
        disableAnimation={true}
        removeFileFunc={(index) => removeFile(index)}
      />
    );
  }, [files, isPending]);

  const sendMessage = useCallback(
    async (event) => {
      if (isPending || isSendMessageDisable) return;
      event?.preventDefault();

      if (!connectState) {
        showCustomAlert("No internet connection…", "warning");
        return;
      }

      const body = inputTextRef.current.value.trim();
      if (body?.length === 0 && !files) {
        return;
      }
      setIsSendMessageDisable(true);
      setIsPending(true);

      inputTextRef.current.value = "";
      const cid = selectedCID;
      const mid = `${currentUserId}${Date.now()}`;

      const optimisticAttachments = files.map((file) => ({
        file_id: file.name,
        file_name: file.name,
        file_url: file.localUrl,
        file_content_type: file.type,
        file_width: file.width,
        file_height: file.height,
      }));

      let msg = {
        _id: mid,
        body,
        from: currentUserId,
        t: Date.now(),
        attachments: optimisticAttachments,
      };
      const repliedMid = selectedConversation.draft?.replied_mid;
      repliedMid && (msg["replied_message_id"] = repliedMid);

      dispatch(addMessage(msg));
      dispatch(updateLastMessageField({ cid, msg }));

      let attachments = [];
      const reqData = {
        mid,
        body,
        cid,
        from: currentUserId,
        replied_message_id: repliedMid,
      };

      try {
        if (files?.length) {
          attachments = await DownloadManager.getFileObjects(files);
          reqData.attachments = attachments.map((obj, i) => ({
            file_id: obj.file_id,
            file_name: obj.file_name,
            file_blur_hash: files[i].blurHash,
            file_content_type: files[i].type,
            file_width: files[i].width,
            file_height: files[i].height,
          }));
        }

        const message = await messagesService.sendMessage(reqData);
        const upsertMessageParams = {
          _id: message._id,
          attachments: attachments.map((obj, i) => ({
            file_id: obj.file_id,
            file_name: obj.file_name,
            file_url: obj.file_url || files[i].localUrl,
            file_blur_hash: files[i].blurHash,
            file_content_type: files[i].type,
            file_width: files[i].width,
            file_height: files[i].height,
          })),
        };
        dispatch(upsertMessage(upsertMessageParams));
        draftService.removeDraftWithOptions(selectedCID, [
          "replied_mid",
          "text",
        ]);
        scrollToBottom();
      } catch (err) {
        showCustomAlert("The server connection is unavailable.", "warning");
        dispatch(
          setLastMessageField({ cid, msg: messages[messages.length - 1] })
        );
      } finally {
        setIsSendMessageDisable(false);
        setIsPending(false);
        closeModal(true);
      }
    },
    [
      closeModal,
      connectState,
      currentUserId,
      files,
      isPending,
      isSendMessageDisable,
      messages,
      selectedCID,
    ]
  );

  const scrollToBottom = () => {
    setTimeout(() => {
      const chatContainer = document.getElementById("chatMessagesScrollable");
      chatContainer && (chatContainer.scrollTop = chatContainer.scrollHeight);
    }, 300);
  };

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
      }px`;
      inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
    }
  };

  const pickFileClick = () => inputFilesRef.current.click();

  useEffect(() => {
    localforage.getItem("attachFiles").then((filesFromDragAndDrop) => {
      if (filesFromDragAndDrop?.length) {
        addFiles(filesFromDragAndDrop);
        localforage.removeItem("attachFiles");
      } else {
        pickFileClick();
      }
      syncInputText();
    });

    function handleInput(e) {
      if (!selectedCID) return;

      let files = [];
      const clipboardItems = e.clipboardData || e.originalEvent?.clipboardData;
      if (clipboardItems?.items) {
        files = extractFilesFromClipboard(clipboardItems);
      } else if (e.dataTransfer?.files) {
        files = Array.from(e.dataTransfer.files);
      }

      if (!files.length) return;
      addFiles(files);
    }

    document.addEventListener("drop", handleInput);
    document.addEventListener("paste", handleInput);
    return () => {
      document.removeEventListener("drop", handleInput);
      document.removeEventListener("paste", handleInput);
    };
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
        className="hidden"
        ref={inputFilesRef}
        type="file"
        onChange={(e) => addFiles(Array.from(e.target.files))}
        accept={ALLOWED_FILE_FORMATS}
        multiple
      />
      <div className="absolute top-[0px] p-[10px] w-dvw h-dvh bg-(--color-black-50) z-[200] flex items-center justify-center">
        <div className="p-[30px] w-[500px] max-h-[90svh] flex flex-col gap-[20px] rounded-[32px] bg-(--color-bg-light) max-sm:w-[94svw]">
          <p className="text-h5 !font-normal text-black">
            {files.length > 1
              ? `Selected ${files.length} files`
              : "Send attachment"}
          </p>
          {attachListView}
          <TextAreaInput
            customClassName="py-[12px] px-[15px] resize-none min-h-[40px] h-[40px] max-h-[140px] text-black rounded-[12px] bg-(--color-hover-light) [&::-webkit-scrollbar]:hidden"
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
            <div className="mt-auto justify-end gap-[30px] flex items-center">
              <p
                className="text-h6 text-(--color-accent-dark) !font-light cursor-pointer mr-auto"
                onClick={pickFileClick}
              >
                Add
              </p>
              <p
                className="text-h6 text-(--color-accent-dark) !font-light cursor-pointer"
                onClick={closeModal}
              >
                Cancel
              </p>

              <p
                className="text-h6 text-(--color-accent-dark) !font-light cursor-pointer"
                onClick={sendMessage}
              >
                Send
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
