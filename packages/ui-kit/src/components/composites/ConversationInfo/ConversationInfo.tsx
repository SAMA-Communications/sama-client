import { useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { CustomScrollBar } from "../CustomScrollBar";
import { ParticipantInChat } from "../../elements/ParticipantInChat";
import { ConversationInfoAvatar } from "../../elements/ConversationInfoAvatar";

import { UserPlus, X, Pencil, Users, LogOut } from "lucide-react";

import { ConversationInfoProps } from "./ConversationInfo.types";

export const ConversationInfo = ({ conversation, isMobile }: ConversationInfoProps) => {
  const { useParticipants, useHistory } = getAdapters();
  const { getParticipantsByIdsAsObject, getCurrentUser } = useParticipants();
  const { openEditConversationWindow, openAddParticipantsWindow, closeChatInfoPage } = useHistory();

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

      return <ParticipantInChat key={uId} user={user} isOwner={isOwner} isCurrentUserOwner={isCurrentUserOwner} />;
    });
  }, [conversation, participants, currentUserId]);

  const participantsCount = participantsList?.length || 0;

  return (
    <div className="ui:flex ui:h-full ui:w-100 ui:flex-col ui:gap-2.75 ui:p-3.5 ui:max-md:w-full">
      <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-2.75">
        <div className="ui:flex ui:w-full ui:justify-between ui:gap-2.5">
          <button
            className="ui:mb-1.5 ui:cursor-pointer ui:self-end ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white"
            onClick={closeChatInfoPage}
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
              onClick={openEditConversationWindow}
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
              onClick={openAddParticipantsWindow}
            >
              <UserPlus size={18} />
            </button>
          ) : null}
        </div>
        <CustomScrollBar autoHeight={isMobile ? true : false} autoHeightMax={isMobile ? 400 : 0}>
          {participantsList}
        </CustomScrollBar>
      </div>

      <hr className="ui:mt-auto ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <button
        className="ui:mt-2.75 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:gap-2.75 ui:rounded-xl ui:bg-white ui:p-2 ui:text-danger ui:shadow-btn ui:duration-150 ui:hover:bg-danger ui:hover:text-white"
        onClick={() => {
          // navigateToAuthPage();
          // onLogout();
        }}
      >
        <LogOut size={18} /> Leave Group
      </button>
    </div>
  );
};
