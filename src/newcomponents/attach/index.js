export default function Attach() {
  const handlerChange = async ({ target: { files: pickedFiles } }) => {
    const sendMessage = async (event) => {
      event.preventDefault();

      if (!connectState) {
        showCustomAlert("No internet connection…", "warning");
        return;
      }

      const text = messageInputEl.current.value.trim();
      if ((text.length === 0 && !files) || isSendMessageDisable) {
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
        attachments: files.map((file) => ({
          file_id: file.name,
          file_name: file.name,
          file_url: file.localUrl,
        })),
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

    if (!pickedFiles.length) {
      return;
    }

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
      for (let i = 0; i < pickedFiles.length; i++) {
        const fileObj = pickedFiles[i];
        const formData = new FormData();
        formData.append("file", fileObj, fileObj.name.toLocaleLowerCase());
        let file = formData.get("file");

        if (file.name.length > 255) {
          throw new Error("The file name should not exceed 255 characters.", {
            cause: {
              message: "The file name should not exceed 255 characters.",
            },
          });
        }
        if (file.size > 104857600) {
          throw new Error("The file size should not exceed 100 MB.", {
            cause: {
              message: "The file size should not exceed 100 MB.",
            },
          });
        }

        const fileExtension = file.name.split(".").slice(-1)[0];

        if (
          !globalConstants.allowedFileFormats.includes(file.type) &&
          !["heic", "HEIC"].includes(fileExtension)
        ) {
          throw new Error("Please select an image file.", {
            cause: { message: "Please select an image file." },
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

      if (files?.length + pickedFiles.length > 10) {
        throw new Error("The maximum limit for file uploads is 10.", {
          cause: { message: "The maximum limit for file uploads is 10." },
        });
      }
    } catch (err) {
      err.cause
        ? showCustomAlert(err.cause.message, "warning")
        : console.error(err);
      return;
    }

    setFiles(files?.length ? [...files, ...selectedFiles] : [...selectedFiles]);
    messageInputEl.current.focus();
  };
}
