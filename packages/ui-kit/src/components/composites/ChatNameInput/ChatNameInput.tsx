import { useCallback, useRef, useState } from "react";

import { clsx } from "clsx";
import { Camera, Image } from "lucide-react";

import type { ChatNameInputProps } from "@composites/ChatNameInput/ChatNameInput.types";

import { WrapperRoot } from "@elements/WrapperRoot";

import { useKeyDown } from "@src/hooks/useKeyDown";

import { KEY_CODES, ALLOWED_AVATAR_FORMATS, MAX_CHAT_NAME_LENGTH } from "@utils/constants";
import { generateSoftPastelGradient } from "@utils/generateSoftPastelGradient";

export const ChatNameInput = ({ onConfirm, onCancel, onValidationError, className, ...rest }: ChatNameInputProps) => {
  const [name, setName] = useState("");
  const [localUrlImage, setLocalUrlImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const inputFilesRef = useRef<HTMLInputElement>(null);

  const confirmChatName = useCallback(() => {
    const trimmed = name?.trim();
    if (!trimmed?.length) {
      onValidationError?.("Enter a name for the group chat.");
      return;
    }
    if (trimmed.length > MAX_CHAT_NAME_LENGTH) {
      onValidationError?.(`The length of the chat name should not exceed ${MAX_CHAT_NAME_LENGTH} characters.`);
      return;
    }
    onConfirm(trimmed, imageFile);
  }, [name, imageFile, onConfirm, onValidationError]);

  useKeyDown(KEY_CODES.ENTER, confirmChatName);

  const pickFileClick = () => inputFilesRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = Array.from(e.target.files ?? []).at(0);
    if (file) {
      setImageFile(file);
      setLocalUrlImage(URL.createObjectURL(file));
    }
  };

  return (
    <WrapperRoot className={clsx(className)} {...rest}>
      <div className="ui:flex ui:flex-1 ui:flex-row ui:gap-4">
        <div className="ui:relative ui:h-26 ui:w-26 ui:self-center">
          <div
            className="ui:relative ui:flex ui:h-full ui:w-full ui:cursor-pointer ui:items-center ui:justify-center ui:overflow-hidden ui:rounded-3xl"
            style={{ background: generateSoftPastelGradient("") }}
            onClick={pickFileClick}
          >
            {localUrlImage ? (
              <img className="ui:h-full ui:w-full ui:object-cover" src={localUrlImage} alt="Group" />
            ) : (
              <Image size={70} color="white" />
            )}
            <input
              id="inputFile"
              className="ui:hidden"
              ref={inputFilesRef}
              type="file"
              onChange={handleFileChange}
              accept={ALLOWED_AVATAR_FORMATS.join(",")}
              multiple={false}
            />
          </div>
          <div
            className="ui:absolute ui:-right-1.25 ui:-bottom-1.25 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:rounded-full ui:border-4 ui:border-bg-light ui:bg-accent-500 ui:p-2"
            onClick={pickFileClick}
          >
            <Camera size={28} color="white" />
          </div>
        </div>
        <div className="ui:flex ui:flex-1 ui:flex-col ui:justify-center ui:gap-2">
          <p className="ui:text-lg ui:font-normal ui:text-black">Group name</p>
          <input
            className="ui:text-p ui:shrink ui:rounded-xl ui:bg-hover-light ui:px-4 ui:py-2 ui:font-light ui:text-black ui:focus:outline-none"
            placeholder="Enter group name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
        </div>
      </div>
      <hr className="ui:my-2.75 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <div className="ui:flex ui:items-center ui:justify-between ui:gap-8">
        <button className="ui:cursor-pointer ui:px-3 ui:font-light ui:text-text-dark/75" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75 ui:rounded-xl ui:bg-accent-500 ui:px-6 ui:py-2 ui:text-white ui:duration-150 ui:hover:bg-black"
          onClick={confirmChatName}
        >
          Continue
        </button>
      </div>
    </WrapperRoot>
  );
};
