import { getAdapters } from "../../../adapters";

import { DynamicAvatar } from "../../../components/DynamicAvatar";

import { ParticipantInChatProps } from "./ParticipantInChat.types";

export const ParticipantInChat = ({
  user,
  isOwner,
  isCurrentUserOwner,
}: ParticipantInChatProps) => {
  const { useParticipants, useHistory, userUtils } = getAdapters();
  const { getCurrentUser } = useParticipants();
  const { getUserInitials, getUserFullName } = userUtils;
  const { openCurrentUserProfile, openProfileById, openContextMenuWithParams } =
    useHistory();

  const currentUserId = getCurrentUser()._id;
  const isCurrentUser = currentUserId === user._id;

  return (
    <div
      className={`tensition-[background] flex cursor-pointer items-center gap-[20px] rounded-[12px] p-[10px] duration-200 hover:bg-(--color-accent-dark)`}
      onClick={() =>
        isCurrentUser ? openCurrentUserProfile() : openProfileById(user._id)
      }
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenuWithParams({
          category: "conversation",
          list: [
            "participantInfo",
            isCurrentUser ? null : "participantSendMessage",
            !isCurrentUserOwner || isCurrentUser
              ? null
              : "convRemoveParticipants",
          ],
          coords: { x: e.pageX, y: e.pageY },
          externalProps: { user },
          clicked: true,
        });
      }}
    >
      <div className="text-h4 flex h-[70px] w-[70px] items-center justify-center overflow-hidden rounded-[8px] bg-(--color-bg-light)">
        <DynamicAvatar
          avatarUrl={user.avatar_url}
          avatarBlurHash={user.avatar_object?.file_blur_hash}
          defaultIcon={user ? getUserInitials(user) : null}
        />
      </div>
      <div className="flex flex-1 flex-col gap-[5px] overflow-hidden">
        <p className="text-h6 overflow-hidden !font-medium text-ellipsis whitespace-nowrap text-black">
          {getUserFullName(user)}
        </p>
        {isOwner ? <span className="text-h6 text-black">admin</span> : null}
      </div>
    </div>
  );
};
