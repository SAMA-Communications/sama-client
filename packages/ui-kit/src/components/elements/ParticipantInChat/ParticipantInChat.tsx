import { getAdapters } from "../../../adapters";

import { DynamicAvatar } from "../DynamicAvatar";

import { ParticipantInChatProps } from "./ParticipantInChat.types";

export const ParticipantInChat = ({ user, isOwner, isCurrentUserOwner }: ParticipantInChatProps) => {
  const { useParticipants, useHistory, userUtils } = getAdapters();
  const { getCurrentUser } = useParticipants();
  const { getUserInitials, getUserFullName } = userUtils;
  const { openCurrentUserProfile, openProfileById, openContextMenuWithParams } = useHistory();

  const currentUserId = getCurrentUser()._id;
  const isCurrentUser = currentUserId === user._id;

  return (
    <div
      className={`ui:relative ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:gap-3.75 ui:rounded-2xl ui:px-1.5 ui:py-2.5 ui:duration-100 ui:hover:bg-accent-500/20 ui:focus:outline-none`}
      onClick={() => (isCurrentUser ? openCurrentUserProfile() : openProfileById(user._id))}
      onContextMenu={(e) => {
        e.preventDefault();
        openContextMenuWithParams({
          category: "conversation",
          list: [
            "participantInfo",
            isCurrentUser ? null : "participantSendMessage",
            !isCurrentUserOwner || isCurrentUser ? null : "convRemoveParticipants",
          ],
          coords: { x: e.pageX, y: e.pageY },
          externalProps: { user },
          clicked: true,
        });
      }}
    >
      <DynamicAvatar
        size={60}
        avatarUrl={user.avatar_url}
        avatarBlurHash={user.avatar_object?.file_blur_hash}
        defaultIcon={user ? getUserInitials(user) : null}
        bgColorKey={user._id}
      />
      <div className="ui:flex ui:flex-1 ui:flex-col ui:gap-0.75 ui:overflow-hidden">
        <p className="ui:overflow-hidden ui:text-lg ui:text-ellipsis ui:whitespace-nowrap">{getUserFullName(user)}</p>
        {isOwner ? <span className="ui:text-sm ui:text-accent-500">admin</span> : null}
      </div>
    </div>
  );
};
