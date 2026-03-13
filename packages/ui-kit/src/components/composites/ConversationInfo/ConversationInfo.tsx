import { useMemo } from "react";
import { clsx } from "clsx";

import { getAdapters } from "../../../adapters";

import { useConfirmWindow } from "../../../hooks/useConfirmWindow";

import { CustomVerticalScrollbar } from "../CustomVerticalScrollbar";
import { ParticipantInChat } from "../../elements/ParticipantInChat";
import { ConversationInfoAvatar } from "../../elements/ConversationInfoAvatar";
import { WrapperRoot } from "../../elements/WrapperRoot";

import { UserPlus, X, Users, LogOut, MessageCircleOff } from "lucide-react";

import type { ConversationInfoProps } from "./ConversationInfo.types";

export const ConversationInfo = ({
  conversation,
  isMobile,
  onClose,
  onEditConversation,
  onAddParticipants,
  onParticipantOpenProfile,
  onParticipantContextMenu,
  className,
  ...rest
}: ConversationInfoProps) => {
  const { useParticipants, useConversations } = getAdapters();
  const { getParticipantsByIdsAsObject, getCurrentUser } = useParticipants();
  const { deleteAndLeave } = useConversations();

  const confirm = useConfirmWindow();

  const participants = getParticipantsByIdsAsObject(conversation.participants || []);
  const currentUserId = getCurrentUser()._id;
  const conversationOwner = conversation.owner_id?.toString();

  const isCurrentUserOwner = useMemo(() => {
    if (!currentUserId || !conversation) return false;
    return currentUserId === conversation.owner_id?.toString();
  }, [currentUserId, conversation]);

  //   useKeyDown(KEY_CODES.ENTER, (e) => e.preventDefault());

  const participantsList = useMemo(() => {
    if (!conversation.participants || !currentUserId) {
      return null;
    }

    return conversation.participants.map((uId) => {
      const user = participants[uId];
      if (!user) return null;

      const isOwner = user._id === conversationOwner;

      return (
        <ParticipantInChat
          key={uId}
          user={user}
          isOwner={isOwner}
          isCurrentUserOwner={isCurrentUserOwner}
          onOpenProfile={onParticipantOpenProfile}
          onRequestContextMenu={onParticipantContextMenu}
        />
      );
    });
  }, [conversation, participants, currentUserId]);

  const participantsCount = participantsList?.length || 0;

  const onDeleteConversation = async () => {
    const { isConfirm } = await confirm<{}>({
      title: "Delate And Leave",
      description: `Do you want to delete this chat?`,
      icon: <MessageCircleOff size={40} color="red" strokeWidth={2} />,
    });
    if (!isConfirm) return;
    deleteAndLeave();
  };

  return (
    <WrapperRoot as="section" className={clsx("ui:flex ui:h-full ui:w-100 ui:flex-col ui:gap-2.75 ui:p-3.5 ui:max-md:w-full", className)} {...rest}>
      <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-2.75">
        <div className="ui:flex ui:w-full ui:justify-between ui:gap-2.5">
          <button
            className="ui:mb-1.5 ui:cursor-pointer ui:self-end ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <ConversationInfoAvatar conversation={conversation} isEditDisabled={!isCurrentUserOwner} />
        <div className="ui:flex ui:w-4/5 ui:flex-col ui:gap-2.75">
          <p className="ui:overflow-hidden ui:text-center ui:text-2xl ui:font-medium ui:text-ellipsis ui:whitespace-nowrap">
            {conversation.name || "Group name"}
          </p>
          {conversation.description ? (
            <p className="ui:line-clamp-2 ui:max-h-12 ui:overflow-hidden ui:text-text-dark">
              (<span className="">{conversation.description}</span>)
            </p>
          ) : null}
          {isCurrentUserOwner ? (
            <p
              className="ui:-mt-1.75 ui:cursor-pointer ui:text-center ui:text-lg ui:text-accent-500"
              onClick={onEditConversation}
            >
              Edit Group Info
            </p>
          ) : null}
        </div>
      </div>

      <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <div className="ui:flex ui:flex-1 ui:flex-col ui:gap-2.75">
        <div className="ui:flex ui:justify-between ui:gap-2.75">
          <div className="ui:flex ui:items-center ui:gap-1.75 ui:rounded-xl ui:bg-bg-dark/5 ui:p-2 ui:text-text-dark">
            <Users size={18} />
            <p className="ui:text-sm">
              {participantsCount} member{participantsCount > 1 ? "s" : ""}
            </p>
          </div>
          {isCurrentUserOwner ? (
            <button
              className="ui:cursor-pointer ui:rounded-xl ui:bg-hover-light ui:p-2 ui:duration-150 ui:hover:bg-accent-500 ui:hover:text-white"
              onClick={onAddParticipants}
            >
              <UserPlus size={18} />
            </button>
          ) : null}
        </div>
        <CustomVerticalScrollbar autoHeight={!!isMobile} autoHeightMax={isMobile ? 400 : undefined}>
          {participantsList}
        </CustomVerticalScrollbar>
      </div>

      <hr className="ui:mt-auto ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <button
        className="ui:mt-2.75 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:gap-2.75 ui:rounded-xl ui:bg-white ui:p-2 ui:text-danger ui:shadow-btn ui:duration-150 ui:hover:bg-danger ui:hover:text-white"
        onClick={onDeleteConversation}
      >
        <LogOut size={18} /> Leave Group
      </button>
    </WrapperRoot>
  );
};
