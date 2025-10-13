import * as m from "motion/react-m";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useMemo } from "react";

import TypingLine from "@components/_helpers/TypingLine";

import messagesService from "@services/messagesService.js";

import {
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { getIsTabletView } from "@store/values/IsTabletView";
import { getIsMobileView } from "@store/values/IsMobileView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setAllParams } from "@store/values/ContextMenu";

import { useKeyDown } from "@hooks/useKeyDown.js";
import { useConfirmWindow } from "@hooks/useConfirmWindow.js";

import {
  addSuffix,
  navigateTo,
  removeSectionAndNavigate,
  removeAndNavigateLastSection,
} from "@utils/NavigationUtils.js";
import showCustomAlert from "@utils/show_alert";
import getLastVisitTime from "@utils/user/get_last_visit_time";
import getUserFullName from "@utils/user/get_user_full_name";
import { KEY_CODES } from "@utils/global/keyCodes.js";

import BackBtn from "@icons/options/Back.svg?react";
import More from "@icons/options/More.svg?react";
import Forward from "@icons/context/ForwardWhiteBold.svg?react";
import Delete from "@icons/context/DeleteWhite.svg?react";

export default function ChatFormHeader({ closeFormFunc }) {
  const dispatch = useDispatch();

  const confirmWindow = useConfirmWindow();

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
  const isSelectionMode = hash.includes("/selection");

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
        <div className="text-(--color-text-light) mb-[9px]">
          <TypingLine
            userIds={selectedConversation.typing_users}
            displayBackground={isGroupChat}
            displayUserNames={isGroupChat}
          />
        </div>
      );
    }

    if (selectedConversation.type === "u") {
      if (!isOpponentExist) {
        return null;
      }
      const opponentLastActivity = participants[opponentId]?.recent_activity;
      return (
        <div className="text-(--color-text-light) mb-[9px]">
          {opponentLastActivity === 0 ? (
            <m.ul
              initial={{ y: -8, opacity: 0.7 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
              className="ml-[5px] flex items-center gap-[10px]"
            >
              <span className="mt-[3px] w-[7px] h-[7px] rounded-full bg-accent-dark"></span>
              <li className="text-accent-dark !font-light">online</li>
            </m.ul>
          ) : (
            getLastVisitTime(opponentLastActivity)
          )}
        </div>
      );
    }

    const count = selectedConversation.participants?.length || 0;
    return (
      <m.div
        initial={{ y: -8, opacity: 0.7 }}
        animate={{ y: 0, opacity: 1, transition: { duration: 0.2 } }}
        className="py-[2px] px-[10px] rounded-2xl bg-[var(--color-hover-light)] text-gray-400 mb-[9px] cursor-default text-nowrap"
      >
        {count} member{count > 1 ? "s" : ""}
      </m.div>
    );
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
        category: "conversation",
        list: [
          currentPath.includes("/info")
            ? null
            : !isOpponentExist && !isGroupChat
            ? null
            : "convInfo",
          isCurrentUserOwner && isGroupChat ? "convEdit" : null,
          isCurrentUserOwner && isGroupChat ? "convAddParticipants" : null,
          isCurrentUserCantLeave ? null : "convLeave",
        ],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
      })
    );
  };

  const { countOfSelectedMessages, midsArrayOfSelectedMessages } =
    useMemo(() => {
      const match = hash.match(/mids=\[([^\]]*)\]/);
      if (!match?.[1]) return null;
      const mids = match[1]
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);
      return {
        countOfSelectedMessages: mids.length,
        midsArrayOfSelectedMessages: mids,
      };
    }, [hash]) || {};

  const closeSelectionMode = () =>
    removeSectionAndNavigate(pathname + hash, "/selection");

  useKeyDown(KEY_CODES.ESCAPE, closeSelectionMode);

  return isSelectionMode ? (
    <div className="flex justify-between items-center shrink gap-[10px] pb-[15px] pt-[5px] max-w-full">
      <button
        className="px-[16px] py-[8px] flex items-center gap-[7px] !font-normal text-white bg-accent-dark rounded-md cursor-pointer"
        onClick={async () => {
          navigateTo((pathname + hash).replace("selection", "forward"));
        }}
      >
        <Forward />
        Forward
        <span className="text-white/75">{countOfSelectedMessages}</span>
      </button>
      <button
        className="mr-auto px-[16px] py-[8px] flex items-center gap-[7px] !font-normal text-white bg-accent-dark rounded-md cursor-pointer"
        onClick={async () => {
          const mids = midsArrayOfSelectedMessages;
          const { isConfirm, data } = await confirmWindow({
            title: `Delete selected message${mids.length > 1 ? "s" : ""}?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            action: "messageDelete",
          });
          isConfirm &&
            messagesService.sendMessageDelete(selectedCID, mids, data.type);
          removeAndNavigateLastSection(pathname + hash);
        }}
      >
        <Delete />
        Delete
        <span className="text-white/75">{countOfSelectedMessages}</span>
      </button>
      <button
        className="px-[16px] py-[8px] !font-normal text-accent-dark cursor-pointer"
        onClick={closeSelectionMode}
      >
        Cancel
      </button>
    </div>
  ) : (
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
        {viewStatusActivity}
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
