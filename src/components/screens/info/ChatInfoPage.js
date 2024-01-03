import ParticipantInChatInfo from "../../generic/chatComponents/ParticipantInChatInfo";
import api from "@api/api";
import getPrevPage from "@utils/get_prev_page";
import jwtDecode from "jwt-decode";
import showCustomAlert from "@utils/show_alert";
import { clearSelectedConversation } from "@store/SelectedConversation";
import { getConverastionById, removeChat } from "@store/Conversations";
import { selectParticipantsEntities } from "@store/Participants";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo, useState } from "react";

import "@styles/pages/chat/ChatInfoPage.css";

import { ReactComponent as TrashCan } from "@icons/chatForm/TrashCan.svg";
import { ReactComponent as BackBtn } from "@icons/chatForm/BackBtn.svg";
import { ReactComponent as GroupChatPhoto } from "@icons/chatList/ChatIconGroup.svg";
import { ReactComponent as AddParticipants } from "@icons/chatList/CreateChatButton.svg";
import { ReactComponent as PenEditIcon } from "@icons/userProfile/PenEditIcon.svg";
import { ReactComponent as ConfirmIcon } from "@icons/userProfile/ConfirmIcon.svg";

export default function ChatInfoPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  const [isLockedDelete, setIsLockedDelete] = useState(true);

  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  const isCurrentUserOwner = useMemo(() => {
    if (!userInfo || !selectedConversation) {
      return false;
    }
    return userInfo._id === selectedConversation.owner_id?.toString();
  }, [userInfo, selectedConversation]);

  window.onkeydown = function (event) {
    event.keyCode === 27 && navigate(getPrevPage(pathname + hash));
    event.keyCode === 13 && event.preventDefault();
  };

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

  const participantsView = useMemo(() => {
    if (!selectedConversation?.participants || !userInfo) {
      return null;
    }

    return selectedConversation.participants.map((el) => {
      const u = participants[el];
      if (!u) {
        return null;
      }

      const isCurrentUser = u._id === userInfo._id;

      const deleteUser = async (event) => {
        event.stopPropagation();

        if (!window.confirm(`Do you want to delete this user?`)) {
          return;
        }

        const requestData = {
          cid: selectedCID,
          participants: { remove: [u._id] },
        };
        await api.conversationUpdate(requestData);
        //remove user form participants field - redux
      };

      return (
        <ParticipantInChatInfo
          key={u._id}
          user={u}
          deleteUserFunc={deleteUser}
          isCurrentUser={isCurrentUser}
          isCurrentUserOwner={isCurrentUserOwner}
          isLockedDelete={isLockedDelete}
        />
      );
    });
  }, [selectedConversation, participants, userInfo]);

  return (
    <div className="chat-options-bg">
      <div className="chat-options-container">
        <div className="co-navigation">
          <div
            className="co-close"
            onClick={() => navigate(getPrevPage(pathname + hash))}
          >
            <BackBtn />
          </div>
          <div className="co-header">Group info</div>
          <div>
            <div className="co-edit">
              {isCurrentUserOwner ? (
                <AddParticipants
                  onClick={() => navigate(pathname + hash + "/addparticipants")}
                />
              ) : null}
            </div>
            <div className="co-delete" onClick={deleteChat}>
              <TrashCan />
            </div>
          </div>
        </div>
        <div className="co-info">
          <div className="co-photo-name">
            <div className="co-photo">
              <GroupChatPhoto />
            </div>
            <div className="co-name">
              <p className="co-p-name">{selectedConversation?.name}</p>
              <p className="co-p-description">
                {selectedConversation?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="co-list">
          <p className="co-list-title">
            Members
            {isCurrentUserOwner ? (
              isLockedDelete ? (
                <PenEditIcon onClick={() => setIsLockedDelete(false)} />
              ) : (
                <ConfirmIcon onClick={() => setIsLockedDelete(true)} />
              )
            ) : null}
          </p>
          <div className="co-list-items">{participantsView}</div>
        </div>
      </div>
    </div>
  );
}
