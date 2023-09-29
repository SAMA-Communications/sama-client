import jwtDecode from "jwt-decode";
import getLastVisitTime from "../../../../utils/get_last_visit_time";
import api from "../../../../api/api";
import showCustomAlert from "../../../../utils/show_alert";
import {
  getConverastionById,
  removeChat,
  selectConversationsEntities,
} from "../../../../store/Conversations";
import { clearSelectedConversation } from "../../../../store/SelectedConversation";
import { history } from "../../../../_helpers/history";
import {
  addUser,
  selectParticipantsEntities,
} from "../../../../store/Participants";
import { useDispatch, useSelector } from "react-redux";
import { useLayoutEffect, useMemo, useState } from "react";

import { ReactComponent as BackBtn } from "./../../../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as RecipientPhoto } from "./../../../../assets/icons/chatForm/RecipientPhoto.svg";
import { ReactComponent as TrashCan } from "./../../../../assets/icons/chatForm/TrashCan.svg";

export default function ChatFormInfo({ closeForm }) {
  const dispatch = useDispatch();

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const participants = useSelector(selectParticipantsEntities);
  const conversations = useSelector(selectConversationsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  // vv  Chat name view  vv //
  const chatNameView = useMemo(() => {
    if (!selectedConversation || !participants) {
      return <p></p>;
    }

    const { owner_id, opponent_id, name } = selectedConversation;
    if (name) {
      return <p>{name}</p>;
    }

    const ownerLogin = participants[owner_id]?.login;
    const opponentLogin = participants[opponent_id]?.login;

    return <p>{owner_id === userInfo._id ? opponentLogin : ownerLogin}</p>;
  }, [selectedConversation, participants]);
  // ʌʌ  Chat name view  ʌʌ //

  // vv  Activity block  vv //
  const opponentId = useMemo(() => {
    const conv = conversations[selectedCID];
    if (!conv) {
      return null;
    }

    return conv.owner_id === userInfo._id
      ? participants[conv.opponent_id]?._id
      : participants[conv.owner_id]?._id;
  }, [selectedCID]);

  const opponentLastActivity = useMemo(
    () => participants[opponentId]?.recent_activity,
    [opponentId, participants]
  );

  const [reloadActivity, setReloadActivity] = useState(false);
  useLayoutEffect(() => {
    const debounce = setTimeout(() => setReloadActivity((prev) => !prev), 250);
    return () => clearTimeout(debounce);
  }, [opponentLastActivity, selectedConversation]);

  const recentActivityView = useMemo(() => {
    if (selectedConversation?.name) {
      return null;
    }

    return opponentLastActivity === "online"
      ? opponentLastActivity
      : getLastVisitTime(opponentLastActivity);
  }, [reloadActivity]);
  // ʌʌ  Activity block  ʌʌ //

  // vv  Delete chat block  vv //
  const deleteChat = async () => {
    const isConfirm = window.confirm(`Do you want to delete this chat?`);
    if (isConfirm) {
      try {
        await api.conversationDelete({ cid: selectedCID });
        dispatch(clearSelectedConversation());
        dispatch(removeChat(selectedCID));
        history.navigate("/main");
      } catch (error) {
        showCustomAlert(error.message, "warning");
      }
    }
  };
  // ʌʌ  Delete chat block  ʌʌ //

  return (
    <div className="chat-form-info">
      <div className="chat-return-btn fcc" onClick={closeForm}>
        <BackBtn />
      </div>
      <div className="chat-info-block">
        <div className="chat-recipient-photo">
          <RecipientPhoto />
        </div>
        <div className="chat-recipient-info">
          {chatNameView}
          <div className="chat-recipient-status">{recentActivityView}</div>
        </div>
      </div>
      <div className="chat-delete-btn" onClick={deleteChat}>
        <TrashCan />
      </div>
    </div>
  );
}
