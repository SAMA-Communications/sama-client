import { useMemo } from "react";

import { getAdapters } from "../../../adapters";

import { CustomScrollBar } from "./../../CustomScrollBar";
import { ParticipantInChat } from "../../../components/elements/ParticipantInChat";
import { ConversationInfoAvatar } from "../../../components/elements/ConversationInfoAvatar";

import { UserPlus, Undo2, X, Pencil } from "lucide-react";

import { ChatInfoProps } from "./ChatInfo.types";

export const ChatInfo = ({
  conversation,
  isMobile,
  shareRef,
}: ChatInfoProps) => {
  const { useParticipants, useHistory } = getAdapters();
  const { getParticipantsByIdsAsObject, getCurrentUser } = useParticipants();
  const {
    openEditConversationWindow,
    openAddParticipantsWindow,
    closeChatInfoPage,
  } = useHistory();

  const participants = getParticipantsByIdsAsObject(
    conversation.participants || [],
  );
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
        />
      );
    });
  }, [conversation, participants, currentUserId]);

  const participantsCount = participantsList?.length || 0;

  return (
    <div
      ref={shareRef}
      className="shrink max-md:!w-dvw md:my-[20px] md:mr-[20px] md:w-[400px]"
    >
      <CustomScrollBar childrenClassName="flex flex-col gap-[15px]">
        <div className="flex flex-col items-center justify-center gap-[20px] rounded-[32px] bg-(--color-bg-light) py-[30px] max-md:rounded-t-[0px] max-md:rounded-b-[16px]">
          <div className="text-h4 mb-[10px] text-center !font-normal text-black">
            Chat info
          </div>
          {isMobile ? (
            <Undo2
              strokeWidth={1}
              size={25}
              className="absolute top-[30px] right-[30px] cursor-pointer max-md:top-[34px] max-md:left-[4svw]"
              onClick={closeChatInfoPage}
            />
          ) : (
            <X
              strokeWidth={1}
              size={25}
              className="absolute top-[30px] right-[30px] cursor-pointer max-md:top-[34px] max-md:left-[4svw]"
              onClick={closeChatInfoPage}
            />
          )}
          <ConversationInfoAvatar
            conversation={conversation}
            isEditDisabled={true}
          />
          <div className="w-full px-[30px]">
            <p className="text-h4 max-md:text-h5 overflow-hidden text-center !font-medium text-ellipsis whitespace-nowrap text-black">
              {conversation.name || (
                <span className="text-h4 !font-medium text-(--color-text-dark)">
                  Group name
                </span>
              )}
            </p>
            <p
              className="text-h6 mt-[15px] max-h-[50px] text-center text-black"
              style={{
                display: "-webkit-box",
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                WebkitLineClamp: 2,
              }}
            >
              {conversation.description ? (
                <span className="text-h6 mt-[15px] text-(--colot-text-dark)">
                  Description
                </span>
              ) : null}
            </p>

            {isCurrentUserOwner ? (
              <div
                className="text-h6 flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-(--color-accent-dark) py-[6px] !font-normal text-white"
                onClick={openEditConversationWindow}
              >
                Edit Information
                <Pencil strokeWidth={1} size={18} color="white" />
              </div>
            ) : null}
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-[15px] rounded-[32px] bg-(--color-accent-light) px-[20px] py-[30px] max-md:rounded-t-[16px] max-md:rounded-b-[0px] max-md:pb-[0px]">
          <div className="flex justify-between">
            <p className="text-h5 !font-medium text-black">
              {participantsCount} member{participantsCount > 1 ? "s" : ""}
            </p>
            {isCurrentUserOwner ? (
              <UserPlus
                strokeWidth={1}
                size={28}
                className="cursor-pointer"
                onClick={openAddParticipantsWindow}
              />
            ) : null}
          </div>
          <CustomScrollBar
            autoHeight={isMobile ? true : false}
            autoHeightMax={isMobile ? 400 : 0}
          >
            {participantsList}
          </CustomScrollBar>
        </div>
      </CustomScrollBar>
    </div>
  );
};
