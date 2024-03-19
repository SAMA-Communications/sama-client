import addSuffix from "@utils/navigation/add_suffix";
import getLastVisitTime from "@utils/user/get_last_visit_time";
import getUserFullName from "@utils/user/get_user_full_name";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import {
  getConverastionById,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { getCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setClicked, setCoords, setList } from "@store/values/ContextMenu";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

import "@newstyles/hub/chatForm/ChatFormHeader.css";

import { ReactComponent as More } from "@icons/options/More.svg";

export default function ChatFormHeader() {
  const dispatch = useDispatch();

  const { pathname, hash } = useLocation();
  const currentPath = pathname + hash;

  const participants = useSelector(selectParticipantsEntities);
  const conversations = useSelector(selectConversationsEntities);
  const currentUser = useSelector(getCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const opponentId = useMemo(() => {
    const conversation = conversations[selectedCID];
    if (!conversation) {
      return null;
    }

    const { owner_id, opponent_id } = conversation;
    return participants[owner_id === currentUser._id ? opponent_id : owner_id]
      ?._id;
  }, [selectedCID, conversations, participants]);

  const viewChatName = useMemo(() => {
    if (!selectedConversation || !participants) {
      return;
    }

    if (selectedConversation.name) {
      return selectedConversation.name;
    }
    return getUserFullName(participants[opponentId]);
  }, [selectedConversation, participants, opponentId]);

  const viewStatusActivity = useMemo(() => {
    if (selectedConversation.type === "u") {
      const opponentLastActivity = participants[opponentId]?.recent_activity;
      return opponentLastActivity === "online" ? (
        <ul className="activity--online">
          <li>online</li>
        </ul>
      ) : (
        getLastVisitTime(opponentLastActivity)
      );
    }

    const count = selectedConversation.participants?.length;
    return `${count} member${count > 1 ? "s" : ""}`;
  }, [opponentId, participants, selectedConversation]);

  // MOVE TO MORE OPTIONS BLOCK
  // const deleteChat = async () => {
  //   const isConfirm = window.confirm(`Do you want to delete this chat?`);
  //   if (isConfirm) {
  //     try {
  //       await api.conversationDelete({ cid: selectedCID });
  //       dispatch(clearSelectedConversation());
  //       dispatch(removeChat(selectedCID));
  //       navigate("/main");
  //     } catch (error) {
  //       showCustomAlert(error.message, "warning");
  //     }
  //   }
  // };

  const viewChatOrPaticipantInfo = () => {
    const path =
      selectedConversation.type === "g"
        ? "/info"
        : "/user?uid=" + participants[opponentId]._id;

    (currentPath.includes(path) ? removeAndNavigateLastSection : addSuffix)(
      currentPath,
      path
    );
  };

  const openContextMenu = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(setCoords({ x: e.pageX, y: e.pageY }));
    dispatch(
      setList([
        currentPath.includes("/info") ? null : "infoChat",
        "edit",
        "addParticipants",
        "leave",
      ])
    );
    dispatch(setClicked(true));
  };

  return (
    <div className="header__container" onClick={viewChatOrPaticipantInfo}>
      {/* <div className="header-back"></div> */}
      <div className="header-content">
        <div className="content__name">{viewChatName}</div>
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
