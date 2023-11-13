import api from "../../../api/api";
import getPrevPage from "../../../utils/get_prev_page";
import showCustomAlert from "../../../utils/show_alert";
import jwtDecode from "jwt-decode";
import { clearSelectedConversation } from "../../../store/SelectedConversation";
import { getConverastionById, removeChat } from "../../../store/Conversations";
import { history } from "../../../_helpers/history";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";
import { selectParticipantsEntities } from "../../../store/Participants";

import "../../../styles/pages/chat/ChatInfoPage.css";

import { ReactComponent as TrashCan } from "./../../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as BackBtn } from "./../../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as GroupChatPhoto } from "./../../../assets/icons/chatList/ChatIconGroup.svg";

export default function ChatInfoPage() {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  window.onkeydown = function (event) {
    event.keyCode === 27 &&
      history.navigate(
        getPrevPage(history.location.pathname + history.location.hash)
      );
    event.keyCode === 13 && event.preventDefault();
  };

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
      // const isOwner = userInfo._id === selectedConversation.owner_id.toString();
      return (
        <div
          className="co-list-item"
          key={u._id}
          data-css={isCurrentUser ? "owner" : "opponent"}
          onClick={() => {
            if (isCurrentUser) {
              return;
            }
            const { pathname, hash } = history.location;
            history.navigate(pathname + hash + `/opponentinfo?uid=${u._id}`);
          }}
        >
          {u.login}
          {/* {isCurrentUser || !isOwner ? null : (
            <CloseButtonMini onClick={() => deleteUser(u._id)} />
          )} */}
        </div>
      );
    });
  }, [selectedConversation, participants, userInfo]);

  return (
    <div className="chat-options-bg">
      <div className="chat-options-container">
        <div className="co-navigation">
          <div
            className="co-close"
            onClick={() =>
              history.navigate(
                getPrevPage(history.location.pathname + history.location.hash)
              )
            }
          >
            <BackBtn />
          </div>
          <div className="co-header">Group info</div>
          <div>
            <div className="co-edit">{/* <AddParticipants /> */}</div>
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
          <p className="co-list-title">Members</p>
          <div className="co-list-items">{participantsView}</div>
        </div>
      </div>
    </div>
  );
}
