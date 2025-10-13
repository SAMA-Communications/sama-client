import { useCallback, useRef, useState } from "react";

import { useKeyDown } from "@hooks/useKeyDown";

import { showCustomAlert } from "@utils/GeneralUtils.js";
import { KEY_CODES, ALLOWED_AVATAR_FORMATS } from "@utils/constants.js";

import ImageMedium from "@icons/media/ImageBig.svg?react";

export default function ChatNameInput({ setState, setImage, closeWindow }) {
  const [name, setName] = useState(null);
  const [localUrlImage, setLcalUrlImage] = useState(null);

  const inputFilesRef = useRef(null);

  const confirmChatName = useCallback(() => {
    if (!name?.length) {
      showCustomAlert("Enter a name for the group chat.", "warning");
      return;
    }
    if (name?.length > 255) {
      showCustomAlert(
        "The length of the chat name should not exceed 255 characters.",
        "warning"
      );
      return;
    }
    setState(name);
  }, [name, setState]);

  useKeyDown(KEY_CODES.ENTER, confirmChatName);

  const pickFileClick = () => inputFilesRef.current.click();

  return (
    <>
      <div className="flex flex-1 flex-row gap-[20px]">
        <div
          className="relative w-[100px] h-[100px] rounded-[24px] bg-(--color-bg-dark) cursor-pointer flex items-center justify-center overflow-hidden"
          onClick={pickFileClick}
        >
          <span
            className="absolute w-full h-full bg-(--color-bg-light-25) rounded-[24px] opacity-0 transition-opacity duration-300 hover:opacity-100"
            aria-hidden="true"
          ></span>
          {localUrlImage ? (
            <img
              className="w-full h-full object-cover"
              src={localUrlImage}
              alt="Group"
            />
          ) : (
            <ImageMedium className="w-[80px] h-[80px]" />
          )}
          <input
            id="inputFile"
            className="hidden"
            ref={inputFilesRef}
            type="file"
            onChange={(e) => {
              const file = Array.from(e.target.files).at(0);
              setImage(file);
              setLcalUrlImage(URL.createObjectURL(file));
            }}
            accept={ALLOWED_AVATAR_FORMATS}
            multiple
          />
        </div>
        <div className="flex flex-1 flex-col justify-center gap-[15px]">
          <p className="text-h5 !font-normal text-black">Group name</p>
          <input
            className="py-[11px] px-[15px] shrink text-black text-p !font-light rounded-[12px] bg-(--color-hover-light) focus:outline-none"
            placeholder="Enter group name"
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <div className="mt-auto justify-end gap-[30px] flex items-center">
        <p
          className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
          onClick={closeWindow}
        >
          Cancel
        </p>
        <p
          className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
          onClick={confirmChatName}
        >
          Continue
        </p>
      </div>
    </>
  );
}
