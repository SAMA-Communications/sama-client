import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { useMemo } from "react";

import { TypingLine } from "@sama-communications.ui-kit";

import messagesService from "@services/messagesService.js";

import { getConverastionById, selectConversationsEntities } from "@store/values/Conversations";
import { getIsTabletView } from "@store/values/IsTabletView";
import { getIsMobileView } from "@store/values/IsMobileView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setAllParams } from "@store/values/ContextMenu";

import { useKeyDown } from "@hooks/tools/useKeyDown.js";
import { useConfirmWindow } from "@hooks/tools/useConfirmWindow.js";

import {
  addSuffix,
  navigateTo,
  removeSectionAndNavigate,
  removeAndNavigateLastSection,
} from "@utils/NavigationUtils.js";
import { getLastVisitTime, getUserFullName } from "@utils/UserUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { KEY_CODES, CHAT_CONTENT_TABS } from "@utils/constants.js";

import { ChevronLeft, EllipsisVertical, Code, Trash, Forward } from "lucide-react";

export default function ChatFormHeader({ closeFormFunc, currentTab, changeTabFunc }) {
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

  const isCurrentUserOwner = currentUserId === selectedConversation.owner_id?.toString();
  const isGroupChat = selectedConversation.type === "g";
  const isCurrentUserCantLeave = participants[currentUserId].login.startsWith("sama-user-");
  const isSelectionMode = hash.includes("/selection");

  const opponentId = useMemo(() => {
    const conversation = conversations[selectedCID];
    if (!conversation) {
      return null;
    }

    const { owner_id, opponent_id } = conversation;
    return participants[owner_id === currentUserId ? opponent_id : owner_id]?._id;
  }, [selectedCID, conversations, participants, currentUserId]);

  const isOpponentExist = useMemo(() => !!participants[opponentId]?.login, [participants, opponentId]);

  const viewChatName = useMemo(() => {
    if (!selectedConversation || !participants) {
      return;
    }

    if (selectedConversation.name) {
      return selectedConversation.name;
    }
    return isOpponentExist ? getUserFullName(participants[opponentId]) : "Deleted account";
  }, [selectedConversation, participants, opponentId]);

  const viewStatusActivity = useMemo(() => {
    if (selectedConversation.typing_users?.length) {
      return (
        <div className="mb-[9px] text-(--color-text-light)">
          <TypingLine
            typingUserIds={selectedConversation.typing_users}
            isDisplayBackground={isGroupChat}
            isDisplayUserNames={isGroupChat}
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
        <p className="text-text-light text-sm">
          {opponentLastActivity === 0 ? (
            <ul className="flex items-center gap-2">
              <span className="bg-accent-500 h-1.25 w-1.25 rounded-full"></span>
              <li className="text-accent-500 font-light">online</li>
            </ul>
          ) : (
            getLastVisitTime(opponentLastActivity)
          )}
        </p>
      );
    }

    const count = selectedConversation.participants?.length || 0;
    return (
      <p className="text-text-light text-sm">
        {count} member{count > 1 ? "s" : ""}
      </p>
    );
  }, [opponentId, participants, selectedConversation]);

  const viewChatOrPaticipantInfo = () => {
    if (!isGroupChat && !isOpponentExist) {
      showCustomAlert("This account has been deleted.", "warning");
      return;
    }

    const path = isGroupChat ? "/info" : "/user?uid=" + participants[opponentId]._id;

    const tmpPath =
      isTablet && path === "/info" && pathname.includes("/profile") ? currentPath.replace("/profile", "") : currentPath;

    (tmpPath.includes(path) ? removeAndNavigateLastSection : addSuffix)(tmpPath, path);
  };

  const openContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(
      setAllParams({
        category: "conversation",
        list: [
          currentPath.includes("/info") ? null : !isOpponentExist && !isGroupChat ? null : "convInfo",
          isCurrentUserOwner && isGroupChat ? "convEdit" : null,
          isCurrentUserOwner && isGroupChat ? "convAddParticipants" : null,
          isCurrentUserCantLeave ? null : "convLeave",
        ],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
      }),
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

  const closeSelectionMode = () => removeSectionAndNavigate(pathname + hash, "/selection");

  useKeyDown(KEY_CODES.ESCAPE, closeSelectionMode);

  return isSelectionMode ? (
    <div className="flex h-16 w-full gap-2.5 rounded-xl pt-3.5 pb-1">
      <button
        className="bg-accent-500 flex h-max cursor-pointer items-center gap-1.5 self-center rounded-xl px-2.5 py-1.5 text-white"
        onClick={async () => {
          navigateTo((pathname + hash).replace("selection", "forward"));
        }}
      >
        <Forward size={18} color="white" />
        <p className="text-base">Forward</p>
        <span className="text-white/75">{countOfSelectedMessages}</span>
      </button>
      <button
        className="bg-accent-500 flex h-max cursor-pointer items-center gap-1.5 self-center rounded-xl px-2.5 py-1.5 text-white"
        onClick={async () => {
          const mids = midsArrayOfSelectedMessages;
          const { isConfirm, data } = await confirmWindow({
            title: `Delete selected message${mids.length > 1 ? "s" : ""}?`,
            confirmText: "Delete",
            cancelText: "Cancel",
            action: "messageDelete",
          });
          isConfirm && messagesService.sendMessageDelete(selectedCID, mids, data.type);
          removeAndNavigateLastSection(pathname + hash);
        }}
      >
        <Trash size={18} color="white" />
        <p className="text-base">Delete</p>
        <span className="text-white/75">{countOfSelectedMessages}</span>
      </button>
      <button
        className="text-accent-500 ml-auto h-max cursor-pointer self-center p-1.5 font-normal"
        onClick={closeSelectionMode}
      >
        Cancel
      </button>
    </div>
  ) : (
    <div className="flex h-16 w-full gap-2.5 rounded-xl pt-2 pb-1">
      <button
        className="border-text-dark h-max cursor-pointer self-center rounded-xl border p-2"
        onClick={closeFormFunc}
      >
        <ChevronLeft size={18} />
      </button>
      <div
        className={`flex max-w-[calc(100%-92px)] flex-1 cursor-pointer flex-col justify-center`}
        onClick={viewChatOrPaticipantInfo}
      >
        <p className="overflow-hidden text-lg leading-normal font-medium text-ellipsis whitespace-nowrap text-black">
          {/* &zwnj; */}
          {viewChatName}
        </p>
        {viewStatusActivity}
      </div>
      {isCurrentUserOwner && isGroupChat ? (
        <div className="flex gap-1.5">
          <button
            className={`h-max cursor-pointer self-center rounded-xl border p-2 focus:outline-none ${currentTab === "apps" ? "bg-accent-500 border-accent-500 " : "border-text-dark bg-transparent "}`}
            onClick={() =>
              changeTabFunc(currentTab === "messages" ? CHAT_CONTENT_TABS.APPS : CHAT_CONTENT_TABS.MESSAGES)
            }
          >
            <Code size={18} color={currentTab === "apps" ? "white" : "black"} />
          </button>
        </div>
      ) : null}
      <button
        className="border-text-dark h-max cursor-pointer self-center rounded-xl border p-2"
        onContextMenu={openContextMenu}
        onClick={openContextMenu}
      >
        <EllipsisVertical size={18} />
      </button>
    </div>
  );
}
