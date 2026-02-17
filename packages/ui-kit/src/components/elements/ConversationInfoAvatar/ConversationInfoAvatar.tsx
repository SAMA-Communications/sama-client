import { useRef } from "react";

import { getAdapters } from "../../../adapters";

import { DynamicAvatar } from "../DynamicAvatar";

import { ALLOWED_AVATAR_FORMATS } from "../../../utils/constants";

import { Camera, Image } from "lucide-react";

import { ConversationInfoAvatarProps } from "./ConversationInfoAvatar.types";

export const ConversationInfoAvatar = ({ conversation, isEditDisabled }: ConversationInfoAvatarProps) => {
  const { useConversations } = getAdapters();
  const { updateChatImage } = useConversations();

  const inputFilesRef = useRef<HTMLInputElement | null>(null);

  const pickFileClick = () => inputFilesRef.current?.click();

  const changeChatAvatar = async (file: any) => void (await updateChatImage(file));

  return (
    <div className="ui:relative ui:h-30 ui:w-30 ui:self-center">
      <div
        className={`ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:gap-2.75 ui:overflow-hidden ui:rounded-3xl ui:bg-hover-light`}
      >
        <DynamicAvatar
          size={120}
          avatarUrl={conversation.image_url}
          avatarBlurHash={conversation.image_object?.file_blur_hash}
          defaultIcon={<Image size={80} color="white" />}
          altText="Chat Group"
        />
        <input
          id="inputFile"
          className="ui:invisible ui:hidden"
          ref={inputFilesRef}
          type="file"
          onChange={(e: any) => changeChatAvatar(Array.from(e.target.files).at(0))}
          accept={ALLOWED_AVATAR_FORMATS.join(",")}
          multiple
        />
      </div>
      {isEditDisabled ? null : (
        <div
          className="ui:absolute ui:-right-1.25 ui:-bottom-1.25 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:rounded-full ui:border-4 ui:border-bg-light ui:bg-accent-500 ui:p-2"
          onClick={pickFileClick}
        >
          <Camera size={28} color="white" />
        </div>
      )}
    </div>
  );
};
