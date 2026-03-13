import { clsx } from "clsx";

import { getAdapters } from "@adapters";

import { DynamicAvatar } from "@elements/DynamicAvatar";
import { ParticipantInChatProps } from "@elements/ParticipantInChat/ParticipantInChat.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const defaultClassName =
  "ui:relative ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:gap-3.75 ui:rounded-2xl ui:px-1.5 ui:py-2.5 ui:duration-100 ui:hover:bg-accent-500/20 ui:focus:outline-none";

export const ParticipantInChat = ({
  user,
  isOwner,
  isCurrentUserOwner,
  onOpenProfile,
  onRequestContextMenu,
  className,
  onClick: onClickProp,
  onContextMenu: onContextMenuProp,
  ...rootProps
}: ParticipantInChatProps) => {
  const { useParticipants, userUtils } = getAdapters();
  const { getCurrentUser } = useParticipants();
  const { getUserInitials, getUserFullName } = userUtils;

  const currentUserId = getCurrentUser()._id;
  const isCurrentUser = currentUserId === user._id;

  const handleClick = () => {
    onOpenProfile?.(isCurrentUser ? null : user._id);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRequestContextMenu?.({
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
  };

  return (
    <WrapperRoot
      className={clsx(defaultClassName, className)}
      onClick={(e) => {
        handleClick();
        onClickProp?.(e);
      }}
      onContextMenu={(e) => {
        handleContextMenu(e);
        onContextMenuProp?.(e);
      }}
      {...rootProps}
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
    </WrapperRoot>
  );
};
