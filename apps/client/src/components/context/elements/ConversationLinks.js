import { useLocation } from "react-router";
import { useMemo } from "react";
import { useSelector } from "react-redux";

import conversationService from "@services/conversationsService";

import ContextLink from "@components/context/elements/ContextLink";

import { selectContextExternalProps } from "@store/values/ContextMenu.js";
import { getIsTabletView } from "@store/values/IsTabletView.js";
import {
  getConverastionById,
  selectAllConversations,
} from "@store/values/Conversations.js";

import addPrefix from "@utils/navigation/add_prefix";
import addSuffix from "@utils/navigation/add_suffix";
import navigateTo from "@utils/navigation/navigate_to";

import Info from "@icons/context/Info.svg?react";
import Edit from "@icons/context/Edit.svg?react";
import Leave from "@icons/context/Leave.svg?react";
import Add from "@icons/context/AddParticipants.svg?react";
import Remove from "@icons/context/Remove.svg?react";
import SendMessage from "@icons/context/SendMessage.svg?react";

export default function ConversationLinks({ listOfIds }) {
  const { pathname, hash } = useLocation();
  const { type, opponent_id, owner_id } =
    useSelector(getConverastionById) || {};

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
        icon={<Info />}
        onClick={() => {
          const tmpPath =
            isTabletView && currentPath.includes("/profile")
              ? currentPath.replace("/profile", "")
              : currentPath;
          addSuffix(
            tmpPath,
            type === "g" ? "/info" : `/user?uid=${opponent_id}`
          );
        }}
      />
    ),
    convEdit: (
      <ContextLink
        key={"convEdit"}
        text="Edit"
        icon={<Edit />}
        onClick={() => addSuffix(currentPath, "/edit?type=chat")}
      />
    ),
    convLeave: (
      <ContextLink
        key={"convLeave"}
        text="Delete and leave"
        icon={<Leave />}
        isDangerStyle={true}
        onClick={async () => {
          navigateTo("/");
          await conversationService.deleteConversation();
        }}
      />
    ),
    convAddParticipants: (
      <ContextLink
        key={"convAddParticipants"}
        text="Add participants"
        icon={<Add />}
        onClick={() => addSuffix(currentPath, "/add")}
      />
    ),
    convRemoveParticipants: (
      <ContextLink
        key={"convRemoveParticipants"}
        text="Remove participant"
        icon={<Remove />}
        isDangerStyle={true}
        onClick={() => conversationService.removeParticipant(userObject?._id)}
      />
    ),

    participantInfo: (
      <ContextLink
        key={"participantInfo"}
        text="Info"
        icon={<Info />}
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
        icon={<SendMessage />}
        uObject={userObject}
        onClick={async () => {
          const chatId = await conversationService.createPrivateChat(
            userObject?._id,
            userObject
          );
          navigateTo(`/#${chatId}`);
        }}
      />
    ),
  };

  return useMemo(
    () => listOfIds.map((linkId) => links[linkId]).filter(Boolean),
    [listOfIds, userObject]
  );
}
