import { memo, useCallback, useRef } from "react";

import { clsx } from "clsx";
import { Camera, Image } from "lucide-react";

import { getAdapters } from "@adapters";

import type { ConversationInfoAvatarProps } from "@elements/ConversationInfoAvatar/ConversationInfoAvatar.types";
import { DynamicAvatar } from "@elements/DynamicAvatar";
import { WrapperRoot } from "@elements/WrapperRoot";

import { ALLOWED_AVATAR_FORMATS } from "@utils/constants";

export const ConversationInfoAvatar = memo(function ConversationInfoAvatar({
  conversation,
  isEditDisabled,
  className,
  ...rest
}: ConversationInfoAvatarProps) {
  const { useConversations } = getAdapters();
  const { updateChatImage } = useConversations();
  const inputFilesRef = useRef<HTMLInputElement | null>(null);

  const pickFileClick = useCallback(() => inputFilesRef.current?.click(), []);
  const changeChatAvatar = useCallback(
    async (file: File | undefined) => {
      if (file) await updateChatImage(file);
    },
    [updateChatImage],
  );

  return (
    <WrapperRoot className={clsx("ui:relative ui:h-30 ui:w-30 ui:self-center", className)} {...rest}>
      <div
        className={`ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:gap-2.75 ui:overflow-hidden ui:rounded-3xl ui:bg-hover-light`}
      >
        <DynamicAvatar
          size={120}
          avatarUrl={conversation.image_url}
          avatarBlurHash={conversation.image_object?.file_blur_hash}
          defaultIcon={<Image size={80} color="white" />}
          altText="Chat Group"
          bgColorKey={conversation._id}
        />
        <input
          id="inputFile"
          className="ui:invisible ui:hidden"
          ref={inputFilesRef}
          type="file"
          onChange={(e) => changeChatAvatar(Array.from(e.target.files ?? []).at(0))}
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
    </WrapperRoot>
  );
});
