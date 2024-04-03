import AttachmentItem from "@components/attach/components/AttachmentItem";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import DownloadManager from "@src/adapters/downloadManager";
import OvalLoader from "@components/_helpers/OvalLoader";
import api from "@api/api";
import compressFile from "@utils/compress_file";
import encodeImageToBlurhash from "@utils/get_blur_hash";
import globalConstants from "@helpers/constants";
import heicToPng from "@utils/heic_to_png";
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
import { getNetworkState } from "@store/values/NetworkState";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

import "@styles/attach/AttachHub.css";

export default function AttachHub() {
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();

  const connectState = useSelector(getNetworkState);
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
    newFiles.forEach((el) => (el.localUrl = URL.createObjectURL(el)));

    async function compressAndHashFile(file) {
      file = await compressFile(file);
      const localFileUrl = URL.createObjectURL(file);
      file.localUrl = localFileUrl;

      try {
        file.blurHash = await encodeImageToBlurhash(localFileUrl);
      } catch (e) {
        file.blurHash = globalConstants.defaultBlurHash;
      }

      return file;
    }

    const selectedFiles = [];
    try {
      for (let i = 0; i < newFiles.length; i++) {
        const fileObj = newFiles[i];
        const formData = new FormData();
        formData.append("file", fileObj, fileObj.name.toLocaleLowerCase());
        let file = formData.get("file");

        if (file.name.length > 255) {
          throw new Error("The file name should not exceed 255 characters.", {
            message: "The file name should not exceed 255 characters.",
          });
        }
        if (file.size > 104857600) {
          throw new Error("The file size should not exceed 100 MB.", {
            message: "The file size should not exceed 100 MB.",
          });
        }

        const fileExtension = file.name.split(".").slice(-1)[0];

        if (
          !globalConstants.allowedFileFormats.includes(file.type) &&
          !["heic", "HEIC"].includes(fileExtension)
        ) {
          throw new Error("Please select an image file.", {
            message: "Please select an image file.",
          });
        } else if (["heic", "HEIC"].includes(fileExtension)) {
          const tmp = await heicToPng(file);
          const pngFile = await compressAndHashFile(tmp);

          selectedFiles.push(pngFile);
          continue;
        }

        if (file.type.startsWith("image/")) {
          file = await compressAndHashFile(file);
        }
        selectedFiles.push(file);
      }

      if (files?.length + newFiles.length > 10) {
        throw new Error("The maximum limit for file uploads is 10.", {
          message: "The maximum limit for file uploads is 10.",
        });
      }
    } catch (err) {
      err.message
        ? showCustomAlert(err.message, "warning")
        : console.error(err);
      return;
    }

    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    setIsPending(false);
  };

  const uploadInputText = useCallback(() => {
    if (inputTextRef.current.value) {
      localStorage.setItem("mtext", inputTextRef.current.value);
      inputTextRef.current.value = "";
    }
  }, [inputTextRef]);

  const syncInputText = useCallback(() => {
    const mtext = localStorage.getItem("mtext");
    if (mtext) {
      localStorage.removeItem("mtext");
      inputTextRef.current.value = mtext;
    }
  }, [inputTextRef]);

  const closeModal = useCallback(
    (isForseClose) => {
      const close = () => {
        removeAndNavigateLastSection(pathname + hash);
        uploadInputText();
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
    [files.length, pathname, hash, uploadInputText]
  );

  const removeFile = useCallback(
    (index) => {
      if (files.length === 1 && !closeModal()) {
        return;
      }
      setFiles((prevFiles) =>
        prevFiles.slice(0, index).concat(prevFiles.slice(index + 1))
      );
    },
    [closeModal, files.length]
  );

  const attachListView = useMemo(() => {
    if (isPending) {
      return <OvalLoader width={80} height={80} />;
    }

    if (!files.length) {
      return <p className="attach-input__alt">Select files</p>;
    }

    return files.map((file, index) => (
      <AttachmentItem
        key={index}
        removeFileFunc={() => removeFile(index)}
        url={file.localUrl}
        name={file.name}
        size={(file.size / 1000000).toFixed(2)}
      />
    ));
  }, [files, isPending, removeFile]);

  const sendMessage = useCallback(
    async (event) => {
      event?.preventDefault();

      if (!connectState) {
        showCustomAlert("No internet connection…", "warning");
        return;
      }

      const text = inputTextRef.current.value.trim();
      if ((text.length === 0 && !files) || isSendMessageDisable) {
        return;
      }
      setIsSendMessageDisable(true);
      setIsPending(true);

      inputTextRef.current.value = "";
      const cid = selectedCID;
      const mid = currentUser._id + Date.now();

      let msg = {
        _id: mid,
        body: text,
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
      const reqData = { mid, text, cid };

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
          body: text,
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
      dispatch,
      files,
      isSendMessageDisable,
      messages,
      selectedCID,
    ]
  );

  const pickFileClick = useCallback(
    () => inputFilesRef.current.click(),
    [inputFilesRef]
  );

  useEffect(() => {
    pickFileClick();
    syncInputText();
  }, [pickFileClick, syncInputText]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      e.keyCode === KEY_CODES.ESCAPE && closeModal(); //not working sync text
      e.keyCode === KEY_CODES.ENTER && sendMessage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [closeModal, sendMessage]);

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
            autoHeightMax={550}
          >
            {attachListView}
          </CustomScrollBar>
          <textarea
            ref={inputTextRef}
            className="attach-inputs__message"
            placeholder="Type your message"
          />
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
        </div>
      </div>
    </>
  );
}
