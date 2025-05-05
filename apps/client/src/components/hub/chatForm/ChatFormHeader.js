import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useMemo } from "react";

import TypingLine from "@components/_helpers/TypingLine";

import {
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { getIsTabletView } from "@store/values/IsTabletView";
import { getIsMobileView } from "@store/values/IsMobileView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setAllParams } from "@store/values/ContextMenu";

import addSuffix from "@utils/navigation/add_suffix";
import getLastVisitTime from "@utils/user/get_last_visit_time";
import getUserFullName from "@utils/user/get_user_full_name";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";

import BackBtn from "@icons/options/Back.svg?react";
import More from "@icons/options/More.svg?react";

export default function ChatFormHeader({ closeFormFunc }) {
  const dispatch = useDispatch();

  const isMobile = useSelector(getIsMobileView);
  const isTablet = useSelector(getIsTabletView);

  const { pathname, hash } = useLocation();
  const currentPath = pathname + hash;

  const participants = useSelector(selectParticipantsEntities);
  const conversations = useSelector(selectConversationsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const isCurrentUserOwner =
    currentUserId === selectedConversation.owner_id?.toString();
  const isGroupChat = selectedConversation.type === "g";
  const isCurrentUserCantLeave =
    participants[currentUserId].login.startsWith("sama-user-");

  const opponentId = useMemo(() => {
    const conversation = conversations[selectedCID];
    if (!conversation) {
      return null;
    }

    const { owner_id, opponent_id } = conversation;
    return participants[owner_id === currentUserId ? opponent_id : owner_id]
      ?._id;
  }, [selectedCID, conversations, participants, currentUserId]);

  const isOpponentExist = useMemo(
    () => !!participants[opponentId]?.login,
    [participants, opponentId]
  );

  const viewChatName = useMemo(() => {
    if (!selectedConversation || !participants) {
      return;
    }

    if (selectedConversation.name) {
      return selectedConversation.name;
    }
    return isOpponentExist
      ? getUserFullName(participants[opponentId])
      : "Deleted account";
  }, [selectedConversation, participants, opponentId]);

  const viewStatusActivity = useMemo(() => {
    if (selectedConversation.typing_users?.length) {
      return (
        <TypingLine
          userIds={selectedConversation.typing_users}
          displayUserNames={selectedConversation.type === "g"}
        />
      );
    }

    if (selectedConversation.type === "u") {
      if (!isOpponentExist) {
        return null;
      }
      const opponentLastActivity = participants[opponentId]?.recent_activity;
      return opponentLastActivity === "online" ? (
        <ul className="pl-[25px]">
          <li className="text-(--color-accent-dark)">online</li>
        </ul>
      ) : (
        getLastVisitTime(opponentLastActivity)
      );
    }

    const count = selectedConversation.participants?.length || 0;
    return `${count} member${count > 1 ? "s" : ""}`;
  }, [opponentId, participants, selectedConversation]);

  const viewChatOrPaticipantInfo = () => {
    if (!isGroupChat && !isOpponentExist) {
      showCustomAlert("This account has been deleted.", "warning");
      return;
    }

    const path = isGroupChat
      ? "/info"
      : "/user?uid=" + participants[opponentId]._id;

    const tmpPath =
      isTablet && path === "/info" && pathname.includes("/profile")
        ? currentPath.replace("/profile", "")
        : currentPath;

    (tmpPath.includes(path) ? removeAndNavigateLastSection : addSuffix)(
      tmpPath,
      path
    );
  };

  const openContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setAllParams({
        list: [
          currentPath.includes("/info")
            ? null
            : !isOpponentExist && !isGroupChat
            ? null
            : "infoChat",
          isCurrentUserOwner && isGroupChat ? "edit" : null,
          isCurrentUserOwner && isGroupChat ? "addParticipants" : null,
          isCurrentUserCantLeave ? null : "leave",
        ],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
      })
    );
  };

  return (
    <div
      className="flex shrink pb-[10px] h-max max-w-full"
      onClick={viewChatOrPaticipantInfo}
    >
      {isMobile || isTablet ? (
        <BackBtn
          className="mr-[25px] cursor-pointer self-center"
          onClick={closeFormFunc}
        />
      ) : null}
      <div
        className={`h-max max-xl:max-w-[calc(100%-75px)] xl:max-w-[calc(100%-15px)] -mt-[10px] grow flex cursor-pointer ${
          isGroupChat ? "flex-row items-end gap-[15px] mr-[25px]" : "flex-col"
        } `}
      >
        <p className="!font-medium text-h2 text-black leading-[1.5] overflow-hidden text-ellipsis whitespace-nowrap">
          &zwnj;{viewChatName}
        </p>
        <div
          className={
            isGroupChat
              ? "py-[2px] px-[10px] rounded-2xl bg-[var(--color-hover-light)] text-gray-400 mb-[9px] cursor-default text-nowrap"
              : "text-(--color-text-light)"
          }
        >
          {viewStatusActivity}
        </div>
      </div>
      <div
        className="w-[15px] cursor-pointer flex items-center justify-center"
        onContextMenu={openContextMenu}
        onClick={openContextMenu}
      >
        <More />
      </div>
    </div>
  );
}
