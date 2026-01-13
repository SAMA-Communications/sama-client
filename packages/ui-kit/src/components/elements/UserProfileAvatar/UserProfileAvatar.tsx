import { useRef } from "react";

import { getAdapters } from "../../../adapters";

import { Camera, User } from "lucide-react";

import { DynamicAvatar } from "./../../DynamicAvatar";

import { ALLOWED_AVATAR_FORMATS } from "../../../utils/constants";

import { UserProfileAvatarProps } from "./UserProfileAvatar.types";

export const UserProfileAvatar = ({
  swapAccentAndMainColor,
}: UserProfileAvatarProps) => {
  const { useParticipants } = getAdapters();
  const { getCurrentUser, updateCurrentUserAvatar } = useParticipants();
  const { avatar_url, avatar_blur_hash } = getCurrentUser();

  const inputFilesRef = useRef<HTMLInputElement | null>(null);

  const pickFileClick = () => inputFilesRef.current?.click();

  const changeUserAvatar = async (file: any) =>
    void (await updateCurrentUserAvatar(file));

  return (
    <div className="relative h-[160px] w-[160px] self-center">
      <div
        className={`flex h-full w-full items-center justify-center overflow-hidden rounded-full ${swapAccentAndMainColor ? "bg-(--color-accent-light)" : "bg-(--color-bg-light)"} `}
      >
        <DynamicAvatar
          avatarUrl={avatar_url}
          avatarBlurHash={avatar_blur_hash}
          defaultIcon={
            <User strokeWidth={1} size={80} color="var(--color-text-dark)" />
          }
          altText="User profile"
        />
        <input
          id="inputFile"
          className="invisible hidden"
          ref={inputFilesRef}
          type="file"
          onChange={(e: any) =>
            changeUserAvatar(Array.from(e.target.files).at(0))
          }
          accept={ALLOWED_AVATAR_FORMATS.join(",")}
          multiple
        />
      </div>
      <div
        style={{
          padding: 8,
          borderWidth: 5,
          borderStyle: "solid",
          borderColor: swapAccentAndMainColor
            ? "var(--color-bg-light)"
            : "var(--color-accent-light)",
          bottom: -5,
          right: -5,
        }}
        className="absolute flex cursor-pointer items-center justify-center rounded-full bg-(--color-accent-dark)"
        onClick={pickFileClick}
      >
        <Camera strokeWidth={1} size={28} color="white" />
      </div>
    </div>
  );
};
