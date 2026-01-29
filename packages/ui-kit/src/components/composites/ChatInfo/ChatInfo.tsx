import { useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { CustomScrollBar } from "../CustomScrollBar";
import { ParticipantInChat } from "../../../components/elements/ParticipantInChat";
import { ConversationInfoAvatar } from "../../../components/elements/ConversationInfoAvatar";

import { UserPlus, X, Pencil, Users } from "lucide-react";

import { ChatInfoProps } from "./ChatInfo.types";

export const ChatInfo = ({ conversation, isMobile }: ChatInfoProps) => {
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
    <div className="ui:h-full ui:w-full ui:gap-2.75 ui:p-3.5 ui:md:w-100">
      <CustomScrollBar childrenClassName="ui:flex ui:flex-col">
        <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-2.75">
          <button className="ui:mb-1.5 ui:cursor-pointer ui:self-end ui:rounded-xl ui:border ui:border-text-dark ui:p-2">
            <X size={18} color="var(--color-text-dark)" onClick={closeChatInfoPage} />
          </button>
          <ConversationInfoAvatar conversation={conversation} isEditDisabled={!isCurrentUserOwner} />
          <div className="ui:flex ui:w-4/5 ui:flex-col ui:gap-2.75">
            <p className="ui:overflow-hidden ui:text-center ui:text-2xl ui:font-medium ui:text-ellipsis ui:whitespace-nowrap">
              {conversation.name || "Group name"}
            </p>
            {conversation.description ? (
              <p className="ui:line-clamp-2 ui:max-h-12 ui:overflow-hidden ui:text-sm ui:text-text-dark">
                (<span className="">{conversation.description}</span>)
              </p>
            ) : null}
          </div>
          {isCurrentUserOwner ? (
            <button
              className="ui:mt-2.75 ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:justify-center ui:gap-2.75 ui:rounded-xl ui:border ui:border-accent-500 ui:p-2 ui:text-accent-500"
              onClick={openEditConversationWindow}
            >
              Edit Information
              <Pencil size={18} color="var(--color-accent-500)" />
            </button>
          ) : null}
        </div>

        <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:text-text-dark/40" />
        <div className="ui:flex ui:flex-1 ui:flex-col ui:gap-2.75">
          <div className="ui:flex ui:justify-between ui:gap-2.75">
            <div className="ui:flex ui:items-center ui:gap-1.75 ui:rounded-xl ui:border ui:border-text-dark ui:p-2 ui:text-text-dark">
              <Users size={18} />
              <p className="ui:text-sm">
                {participantsCount} member{participantsCount > 1 ? "s" : ""}
              </p>
            </div>
            {isCurrentUserOwner ? (
              <button className="ui:cursor-pointer ui:rounded-xl ui:border ui:border-accent-500 ui:p-2">
                <UserPlus
                  size={18}
                  color="var(--color-accent-500)"
                  className="cursor-pointer"
                  onClick={openAddParticipantsWindow}
                />
              </button>
            ) : null}
          </div>
          <CustomScrollBar autoHeight={isMobile ? true : false} autoHeightMax={isMobile ? 400 : 0}>
            {participantsList}
          </CustomScrollBar>
        </div>
      </CustomScrollBar>
    </div>
  );
};
