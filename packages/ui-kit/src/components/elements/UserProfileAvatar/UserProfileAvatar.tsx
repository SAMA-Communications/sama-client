import { useRef } from "react";

import { getAdapters } from "../../../adapters";

import { DynamicAvatar } from "../DynamicAvatar";

import { ALLOWED_AVATAR_FORMATS } from "../../../utils/constants";

import { Camera, User } from "lucide-react";

import { UserProfileAvatarProps } from "./UserProfileAvatar.types";

export const UserProfileAvatar = ({ swapAccentAndMainColor }: UserProfileAvatarProps) => {
  const { useParticipants } = getAdapters();
  const { getCurrentUser, updateCurrentUserAvatar } = useParticipants();
  const { avatar_url, avatar_blur_hash } = getCurrentUser();

  const inputFilesRef = useRef<HTMLInputElement | null>(null);

  const pickFileClick = () => inputFilesRef.current?.click();

  const changeUserAvatar = async (file: any) => void (await updateCurrentUserAvatar(file));

  return (
    <div className="ui:relative ui:h-30 ui:w-30 ui:self-center">
      <div
        className={`ui:flex ui:h-full ui:w-full ui:items-center ui:justify-center ui:gap-2.75 ui:overflow-hidden ui:rounded-full ui:bg-hover-light ${swapAccentAndMainColor ? "ui:bg-accent-100" : "ui:bg-bg-light"} `}
      >
        <DynamicAvatar
          size={120}
          avatarUrl={avatar_url}
          avatarBlurHash={avatar_blur_hash}
          defaultIcon={<User size={80} color="white" />}
          altText="User profile"
        />
        <input
          id="inputFile"
          className="ui:invisible ui:hidden"
          ref={inputFilesRef}
          type="file"
          onChange={(e: any) => changeUserAvatar(Array.from(e.target.files).at(0))}
          accept={ALLOWED_AVATAR_FORMATS.join(",")}
          multiple
        />
      </div>
      <div
        className="ui:absolute ui:-right-1.25 ui:-bottom-1.25 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:rounded-full ui:border-4 ui:border-bg-light ui:bg-accent-500 ui:p-2"
        onClick={pickFileClick}
      >
        <Camera strokeWidth={1} size={28} color="white" />
      </div>
    </div>
  );
};
