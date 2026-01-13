import { useRef } from "react";

import { getAdapters } from "../../../adapters";

import { DynamicAvatar } from "./../../DynamicAvatar";

import { Camera, Image } from "lucide-react";

import { ALLOWED_AVATAR_FORMATS } from "../../../utils/constants";

import { ConversationInfoAvatarProps } from "./ConversationInfoAvatar.types";

export const ConversationInfoAvatar = ({
  conversation,
  isEditDisabled,
}: ConversationInfoAvatarProps) => {
  const { useConversations } = getAdapters();
  const { updateChatImage } = useConversations();

  const inputFilesRef = useRef<HTMLInputElement | null>(null);

  const pickFileClick = () => inputFilesRef.current?.click();

  const changeChatAvatar = async (file: any) =>
    void (await updateChatImage(file));

  return (
    <div className="relative h-[160px] w-[160px] self-center">
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[24px] bg-(--color-bg-dark) max-md:h-[120px] max-md:w-[120px]`}
      >
        <DynamicAvatar
          avatarUrl={conversation.image_url}
          avatarBlurHash={conversation.image_object?.file_blur_hash}
          defaultIcon={
            <Image strokeWidth={1} size={80} color="var(--color-text-dark)" />
          }
          altText="Chat Group"
        />
        {isEditDisabled ? null : (
          <input
            id="inputFile"
            className="hidden"
            ref={inputFilesRef}
            type="file"
            onChange={(e: any) =>
              changeChatAvatar(Array.from(e.target.files).at(0))
            }
            accept={ALLOWED_AVATAR_FORMATS.join(",")}
            multiple
          />
        )}
      </div>
      {isEditDisabled ? null : (
        <div
          style={{
            padding: 8,
            borderWidth: 5,
            borderStyle: "solid",
            borderColor: "var(--color-bg-light)",
            bottom: -5,
            right: -5,
          }}
          className="absolute flex cursor-pointer items-center justify-center rounded-full bg-(--color-accent-dark)"
          onClick={pickFileClick}
        >
          <Camera strokeWidth={1} size={28} color="white" />
        </div>
      )}
    </div>
  );
};
