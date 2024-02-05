import api from "@api/api";
import getLastVisitTime from "@utils/get_last_visit_time";
import getUserFullName from "@utils/user/get_user_full_name";
import jwtDecode from "jwt-decode";
import showCustomAlert from "@utils/show_alert";
import {
  getConverastionById,
  removeChat,
  selectConversationsEntities,
} from "@store/values/Conversations";
import { clearSelectedConversation } from "@store/values/SelectedConversation";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import "@newstyles/hub/chatForm/ChatFormHeader.css";

import { ReactComponent as More } from "@newicons/options/More.svg";
import { getCurrentUser } from "@store/values/CurrentUser";

export default function ChatFormHeader() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const conversations = useSelector(selectConversationsEntities);
  const currentUser = useSelector(getCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const closeForm = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }

    dispatch(clearSelectedConversation());
    api.unsubscribeFromUserActivity({});
    navigate("/main");
  };

  document.addEventListener("swiped-left", closeForm);
  document.addEventListener("swiped-right", closeForm);
  window.onkeydown = function ({ keyCode }) {
    keyCode === 27 && closeForm();
  };

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
    if (selectedConversation.type = == "u") {
      const opponentLastActivity = participants[opponentId].recent_activity;
      return opponentLastActivity === "online" ? (
        <ul className="activity--online">
          <li>online</li>
        </ul>
      ) : (
        getLastVisitTime(opponentLastActivity)
      );
    }

    const count = selectedConversation.participants.length;
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
    navigate(
      `/main/#${selectedCID}${
        selectedConversation.type === "g"
          ? "/info"
          : "/opponentinfo?uid=" + participants[opponentId]._id
      }`
    );
  };

  return (
    <div className="header__container" onClick={viewChatOrPaticipantInfo}>
      {/* <div className="header-back"></div> */}
      <div className="header-content">
        <div className="content__name">{viewChatName}</div>
        <div className="content__activity">{viewStatusActivity}</div>
      </div>
      <div className="header-more">
        <More />
      </div>
    </div>
  );
}
