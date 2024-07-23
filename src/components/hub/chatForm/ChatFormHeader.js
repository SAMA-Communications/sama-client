import TypingLine from "@components/_helpers/TypingLine";
import addSuffix from "@utils/navigation/add_suffix";
import getLastVisitTime from "@utils/user/get_last_visit_time";
import getUserFullName from "@utils/user/get_user_full_name";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import {
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { getIsTabletView } from "@store/values/IsTabletView";
import { getIsMobileView } from "@store/values/IsMobileView";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setAllParams } from "@store/values/ContextMenu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import "@styles/hub/chatForm/ChatFormHeader.css";

import { ReactComponent as BackBtn } from "@icons/options/Back.svg";
import { ReactComponent as More } from "@icons/options/More.svg";

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
        <ul className="activity--online">
          <li>online</li>
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
          "leave",
        ],
        coords: { x: e.pageX, y: e.pageY },
        clicked: true,
      })
    );
  };

  return (
    <div className="header__container" onClick={viewChatOrPaticipantInfo}>
      {isMobile || isTablet ? (
        <BackBtn className="header-back" onClick={closeFormFunc} />
      ) : null}
      <div className="header-content">
        <div className="content__name">&zwnj;{viewChatName}</div>
        <div className="content__activity">{viewStatusActivity}</div>
      </div>
      <div
        className="header-more"
        onContextMenu={openContextMenu}
        onClick={openContextMenu}
      >
        <More />
      </div>
    </div>
  );
}
