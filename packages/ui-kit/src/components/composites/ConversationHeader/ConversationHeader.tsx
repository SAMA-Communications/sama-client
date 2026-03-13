import { useMemo } from "react";

import { clsx } from "clsx";
import { ChevronLeft, EllipsisVertical, Code, Trash, Forward } from "lucide-react";

import { getAdapters } from "@adapters";

import type { ConversationHeaderProps } from "@composites/ConversationHeader/ConversationHeader.types";

import { TypingLine } from "@elements/TypingLine";
import { WrapperRoot } from "@elements/WrapperRoot";

import { useKeyDown } from "@src/hooks/useKeyDown";

import { CHAT_CONTENT_TABS, KEY_CODES } from "@utils/constants";

export const ConversationHeader = ({
  conversation,
  isSelectionMode,
  currentTab,
  changeTabFunc,
  closeFormFunc,
  onForwardSection,
  onCloseSelectionMode,
  onOpenChatOrParticipantInfo,
  className,
  ...rest
}: ConversationHeaderProps) => {
  const { useParticipants, useMessages, useContextMenu, userUtils } = getAdapters();
  const { getCurrentUser, getOpponentByCid } = useParticipants();
  const { deleteSelectedMessages, getSelectedMessages } = useMessages();
  const { openContextMenu } = useContextMenu();
  const { getLastVisitTime, getUserFullName } = userUtils;

  const currentUser = getCurrentUser();
  const currentUserId = currentUser._id;

  const selectedConversation = conversation;
  const selectedCID = selectedConversation._id;

  const isCurrentUserOwner = currentUserId === selectedConversation.owner_id?.toString();
  const isGroupChat = selectedConversation.type === "g";
  const isCurrentUserCantLeave = currentUser.login.startsWith("sama-user-");

  const opponentUser = useMemo(() => getOpponentByCid(selectedCID, currentUserId), [selectedCID]);
  const opponentId = opponentUser?._id;

  const isOpponentExist = !!opponentUser;

  const viewChatName = useMemo(() => {
    if (selectedConversation.name) return selectedConversation.name;
    return isOpponentExist ? getUserFullName(opponentUser) : "Deleted account";
  }, [selectedConversation, opponentId]);

  const viewStatusActivity = useMemo(() => {
    if (selectedConversation.typing_users?.length) {
      return (
        <div className="ui:text-text-light">
          <TypingLine
            typingUserIds={selectedConversation.typing_users}
            isDisplayBackground={isGroupChat}
            isDisplayUserNames={isGroupChat}
          />
        </div>
      );
    }

    if (selectedConversation.type === "u") {
      if (!isOpponentExist) return null;
      const opponentLastActivity = opponentUser.recent_activity;
      return (
        <p className="ui:text-sm ui:text-text-light">
          {opponentLastActivity === 0 ? (
            <ul className="ui:flex ui:items-center ui:gap-2">
              <span className="ui:h-1.25 ui:w-1.25 ui:rounded-full ui:bg-accent-500"></span>
              <li className="ui:font-light ui:text-accent-500">online</li>
            </ul>
          ) : (
            getLastVisitTime(opponentLastActivity)
          )}
        </p>
      );
    }

    const count = selectedConversation.participants?.length || 0;
    return (
      <p className="ui:text-sm ui:font-light ui:text-text-light">
        {count} member{count > 1 ? "s" : ""}
      </p>
    );
  }, [opponentUser, selectedConversation]);

  const viewChatOrPaticipantInfo = () => {
    if (!isGroupChat && !isOpponentExist) {
      console.warn("This account has been deleted.");
      return;
    }
    onOpenChatOrParticipantInfo?.(selectedConversation, opponentUser ?? null);
  };

  const onContextMenu = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    openContextMenu(
      "conversation",
      [
        //currentPath.includes("/info")
        false ? null : !isOpponentExist && !isGroupChat ? null : "convInfo",
        isCurrentUserOwner && isGroupChat ? "convEdit" : null,
        isCurrentUserOwner && isGroupChat ? "convAddParticipants" : null,
        isCurrentUserCantLeave ? null : "convLeave",
      ].filter((item): item is string => item !== null),
      { x: e.pageX, y: e.pageY },
    );
  };

  const { countOfSelectedMessages, midsArrayOfSelectedMessages } = getSelectedMessages() || {};

  useKeyDown(KEY_CODES.ESCAPE, onCloseSelectionMode);

  return isSelectionMode ? (
    <WrapperRoot
      className={clsx("ui:flex ui:h-16 ui:w-full ui:gap-2.5 ui:rounded-xl ui:pt-3.5 ui:pb-1", className)}
      {...rest}
    >
      <button
        className="ui:flex ui:h-max ui:cursor-pointer ui:items-center ui:gap-1.5 ui:self-center ui:rounded-xl ui:bg-accent-500 ui:px-2.5 ui:py-1.5 ui:text-white ui:shadow-btn"
        onClick={onForwardSection}
      >
        <Forward size={18} color="white" />
        <p className="ui:text-base">Forward</p>
        <span className="ui:text-white/75">{countOfSelectedMessages}</span>
      </button>
      <button
        className="ui:flex ui:h-max ui:cursor-pointer ui:items-center ui:gap-1.5 ui:self-center ui:rounded-xl ui:bg-accent-500 ui:px-2.5 ui:py-1.5 ui:text-white ui:shadow-btn"
        onClick={async () => await deleteSelectedMessages(selectedCID, midsArrayOfSelectedMessages)}
      >
        <Trash size={18} color="white" />
        <p className="ui:text-base">Delete</p>
        <span className="ui:text-white/75">{countOfSelectedMessages}</span>
      </button>
      <button
        className="ui:ml-auto ui:h-max ui:cursor-pointer ui:self-center ui:p-1.5 ui:font-normal ui:text-accent-500"
        onClick={onCloseSelectionMode}
      >
        Cancel
      </button>
    </WrapperRoot>
  ) : (
    <WrapperRoot
      className={clsx("ui:flex ui:h-16 ui:w-full ui:gap-2.5 ui:rounded-xl ui:pt-2 ui:pb-1", className)}
      {...rest}
    >
      <button
        className="ui:h-max ui:cursor-pointer ui:self-center ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white"
        onClick={closeFormFunc}
      >
        <ChevronLeft size={18} />
      </button>
      <div
        className={`ui:flex ui:max-w-[calc(100%-92px)] ui:flex-1 ui:cursor-pointer ui:flex-col ui:justify-center`}
        onClick={viewChatOrPaticipantInfo}
      >
        <p className="ui:overflow-hidden ui:text-lg ui:leading-normal ui:font-medium ui:text-ellipsis ui:whitespace-nowrap ui:text-black">
          {/* &zwnj; */}
          {viewChatName}
        </p>
        {viewStatusActivity}
      </div>
      {isCurrentUserOwner && isGroupChat ? (
        <div className="flex gap-1.5">
          <button
            className={`ui:h-max ui:cursor-pointer ui:self-center ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white ui:focus:outline-none ${currentTab === "apps" ? "ui:bg-bg-dark! ui:text-white" : ""}`}
            onClick={() =>
              changeTabFunc(currentTab === "messages" ? CHAT_CONTENT_TABS.APPS : CHAT_CONTENT_TABS.MESSAGES)
            }
          >
            <Code size={18} />
          </button>
        </div>
      ) : null}
      <button
        className="ui:h-max ui:cursor-pointer ui:self-center ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:duration-150 ui:hover:bg-bg-dark ui:hover:text-white"
        onContextMenu={onContextMenu}
        onClick={onContextMenu}
      >
        <EllipsisVertical size={18} />
      </button>
    </WrapperRoot>
  );
};
