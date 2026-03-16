import { useMemo } from "react";

import { useLocation } from "react-router";

import { useSelector } from "react-redux";

import { Info, MessageCircleOff, MessageSquareMore, SquarePen, Trash, UserMinus, UserPlus } from "lucide-react";

import { ContextMenuItem, useConfirmWindow, useViewportBreakpoints } from "@sama-communications.ui-kit";

import conversationService from "@services/conversationsService";

import { selectContextExternalProps } from "@store/values/ContextMenu.js";
import { getConverastionById, selectAllConversations } from "@store/values/Conversations.js";

import { addPrefix, addSuffix, navigateTo } from "@utils/NavigationUtils.js";

export default function ConversationActions({ listOfIds }) {
  const confirm = useConfirmWindow();

  const { pathname, hash } = useLocation();
  const { type, opponent_id, owner_id } = useSelector(getConverastionById) || {};

  const currentUser = useSelector(selectAllConversations);
  const currentPath = pathname + hash;
  const { userObject } = useSelector(selectContextExternalProps);

  const isCurrentUserOwner = currentUser._id === owner_id;
  const { isTablet: isTabletView } = useViewportBreakpoints();

  const links = {
    convInfo: (
      <ContextMenuItem
        key={"convInfo"}
        text="Info"
        icon={<Info size={18} />}
        onClick={() => {
          const tmpPath =
            isTabletView && currentPath.includes("/profile") ? currentPath.replace("/profile", "") : currentPath;
          addSuffix(tmpPath, type === "g" ? "/info" : `/user?uid=${opponent_id}`);
        }}
      />
    ),
    convEdit: (
      <ContextMenuItem
        key={"convEdit"}
        text="Edit"
        icon={<SquarePen size={18} />}
        onClick={() => addSuffix(currentPath, "/edit?type=conversation")}
      />
    ),
    convLeave: (
      <ContextMenuItem
        key={"convLeave"}
        text="Delete and leave"
        icon={<Trash size={18} color="red" />}
        isDangerStyle={true}
        onClick={async () => {
          const { isConfirm } = await confirm({
            title: "Delate And Leave",
            description: `Do you want to delete this chat?`,
            icon: <MessageCircleOff size={40} color="red" strokeWidth={2} />,
          });
          if (!isConfirm) return;
          navigateTo("/");
          await conversationService.deleteConversation();
        }}
      />
    ),
    convAddParticipants: (
      <ContextMenuItem
        key={"convAddParticipants"}
        text="Add participants"
        icon={<UserPlus size={18} />}
        onClick={() => addSuffix(currentPath, "/add")}
      />
    ),
    convRemoveParticipants: (
      <ContextMenuItem
        key={"convRemoveParticipants"}
        text="Remove participant"
        icon={<UserMinus size={18} color="red" />}
        isDangerStyle={true}
        onClick={() => conversationService.removeParticipant(userObject?._id)}
      />
    ),

    participantInfo: (
      <ContextMenuItem
        key={"participantInfo"}
        text="Info"
        icon={<Info size={18} />}
        uId={userObject?._id}
        onClick={() => {
          isCurrentUserOwner
            ? addPrefix(currentPath, "/profile")
            : addSuffix(currentPath, `/user?uid=${userObject?._id}`);
        }}
      />
    ),
    participantSendMessage: (
      <ContextMenuItem
        key={"participantSendMessage"}
        text="Write a message"
        icon={<MessageSquareMore size={18} />}
        uObject={userObject}
        onClick={async () => {
          const chatId = await conversationService.createPrivateChat(userObject?._id, userObject);
          navigateTo(`/#${chatId}`);
        }}
      />
    ),
  };

  return useMemo(() => listOfIds.map((linkId) => links[linkId]).filter(Boolean), [listOfIds, userObject]);
}
