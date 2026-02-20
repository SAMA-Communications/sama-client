import { useLocation } from "react-router";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import conversationService from "@services/conversationsService";

import { useConfirmWindow } from "@sama-communications.ui-kit";

import ContextLink from "@components/context/elements/ContextLink";

import { selectContextExternalProps } from "@store/values/ContextMenu.js";
import { getIsTabletView } from "@store/values/IsTabletView.js";
import { getConverastionById, selectAllConversations } from "@store/values/Conversations.js";

import { addPrefix, addSuffix, navigateTo } from "@utils/NavigationUtils.js";

import { Info, MessageCircleOff, MessageSquareMore, SquarePen, Trash, UserMinus, UserPlus } from "lucide-react";

export default function ConversationActions({ listOfIds }) {
  const confirm = useConfirmWindow();

  const { pathname, hash } = useLocation();
  const { type, opponent_id, owner_id } = useSelector(getConverastionById) || {};

  const currentUser = useSelector(selectAllConversations);
  const currentPath = pathname + hash;
  const { userObject } = useSelector(selectContextExternalProps);

  const isCurrentUserOwner = currentUser._id === owner_id;
  const isTabletView = useSelector(getIsTabletView);

  const links = {
    convInfo: (
      <ContextLink
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
      <ContextLink
        key={"convEdit"}
        text="Edit"
        icon={<SquarePen size={18} />}
        onClick={() => addSuffix(currentPath, "/edit?type=chat")}
      />
    ),
    convLeave: (
      <ContextLink
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
      <ContextLink
        key={"convAddParticipants"}
        text="Add participants"
        icon={<UserPlus size={18} />}
        onClick={() => addSuffix(currentPath, "/add")}
      />
    ),
    convRemoveParticipants: (
      <ContextLink
        key={"convRemoveParticipants"}
        text="Remove participant"
        icon={<UserMinus size={18} color="red" />}
        isDangerStyle={true}
        onClick={() => conversationService.removeParticipant(userObject?._id)}
      />
    ),

    participantInfo: (
      <ContextLink
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
      <ContextLink
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
