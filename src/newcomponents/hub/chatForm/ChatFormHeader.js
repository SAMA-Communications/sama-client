import api from "@api/api";
import getLastVisitTime from "@utils/get_last_visit_time";
import jwtDecode from "jwt-decode";
import showCustomAlert from "@utils/show_alert";
import {
  getConverastionById,
  removeChat,
  selectConversationsEntities,
} from "@store/Conversations";
import { clearSelectedConversation } from "@store/SelectedConversation";
import { selectParticipantsEntities } from "@store/Participants";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as BackBtn } from "@icons/chatForm/BackBtn.svg";
import { ReactComponent as GroupChatPhoto } from "@icons/chatList/ChatIconGroup.svg";
import { ReactComponent as PrivateChatPhoto } from "@icons/chatList/ChatIconPrivate.svg";
import { ReactComponent as TrashCan } from "@icons/chatForm/TrashCan.svg";

export default function ChatFormHeader({ closeForm }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const participants = useSelector(selectParticipantsEntities);
  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const chatNameView = useMemo(() => {
    if (!selectedConversation || !participants) {
      return <p></p>;
    }

    const { owner_id, opponent_id, name } = selectedConversation;
    if (name) {
      return <p>{name}</p>;
    }

    function getParticipantName(uId) {
      const u = participants[uId];

      if (u && (u.first_name || u.last_name)) {
        return `${u.first_name || ""} ${u.last_name || ""}`.trim();
      }

      return u?.login;
    }

    return (
      <p>
        {getParticipantName(owner_id === userInfo._id ? opponent_id : owner_id)}
      </p>
    );
  }, [selectedConversation, participants]);

  const opponentId = useMemo(() => {
    const conv = conversations[selectedCID];
    if (!conv) {
      return null;
    }

    return conv.owner_id === userInfo._id
      ? participants[conv.opponent_id]?._id
      : participants[conv.owner_id]?._id;
  }, [selectedCID, participants]);

  const opponentLastActivity = participants[opponentId]?.recent_activity;
  const recentActivityView = useMemo(() => {
    if (selectedConversation.type === "u") {
      return opponentLastActivity === "online"
        ? opponentLastActivity
        : getLastVisitTime(opponentLastActivity);
    }

    return null;
  }, [opponentId, opponentLastActivity, selectedConversation]);

  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: selectedCID });
        dispatch(clearSelectedConversation());
        dispatch(removeChat(selectedCID));
        navigate("/main");
      } catch (error) {
        showCustomAlert(error.message, "warning");
      }
    }
  };

  return (
    <div
      className="chat-form-info"
      onClick={() =>
        navigate(
          `/main/#${selectedCID}${
            selectedConversation.type === "g"
              ? "/info"
              : "/opponentinfo?uid=" + participants[opponentId]._id
          }`
        )
      }
    >
      <div className="chat-return-btn fcc" onClick={closeForm}>
        <BackBtn />
      </div>
      <div className="chat-info-block">
        <div
          className={`chat-recipient-photo ${
            selectedConversation.type === "g" ? "chat-box-icon-g-bg" : null
          }`}
        >
          {selectedConversation.type === "g" ? (
            <GroupChatPhoto />
          ) : (
            <PrivateChatPhoto />
          )}
        </div>
        <div className="chat-recipient-info">
          {chatNameView}
          <div className="chat-recipient-status">{recentActivityView}</div>
        </div>
      </div>
      <div className="chat-delete-btn">
        {selectedConversation.type === "u" ? (
          <TrashCan onClick={deleteChat} />
        ) : null}
      </div>
    </div>
  );
}
