import api from "../../../api/api";
import getPrevPage from "../../../utils/get_prev_page";
import showCustomAlert from "../../../utils/show_alert";
import jwtDecode from "jwt-decode";
import { clearSelectedConversation } from "../../../store/SelectedConversation";
import {
  getConverastionById,
  removeChat,
  upsertParticipants,
} from "../../../store/Conversations";
import { history } from "../../../_helpers/history";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { selectParticipantsEntities } from "../../../store/Participants";

import "../../../styles/pages/chat/ChatInfoPage.css";

import { ReactComponent as TrashCan } from "./../../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as BackBtn } from "./../../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as GroupChatPhoto } from "./../../../assets/icons/chatList/ChatIconGroup.svg";
// import { ReactComponent as CloseButtonMini } from "./../../../assets/icons/chatForm/CloseButtonMini.svg";
// import { ReactComponent as AddParticipants } from "./../../../assets/icons/chatList/CreateChatButton.svg";

export default function ChatInfoPage() {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  useEffect(() => {
    if (!selectedCID) {
      return;
    }

    api
      .getParticipantsByCids({
        cids: [selectedCID],
        includes: ["id"],
      })
      .then((arr) =>
        dispatch(
          upsertParticipants({
            cid: selectedCID,
            participants: arr.map((obj) => obj._id),
          })
        )
      );
  }, []);

  const prevPageLink = useMemo(() => {
    const { hash, pathname } = history.location;
    return getPrevPage(pathname + hash);
  }, [history.location]);

  window.onkeydown = function (event) {
    event.keyCode === 27 && history.navigate(prevPageLink);
    event.keyCode === 13 && event.preventDefault();
  };

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

  // vv  Remove user block  vv //
  const deleteUser = async (uId) => {
    const isConfirm = window.confirm(`Do you want to delete this user?`);
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
  // ʌʌ  Remove user block  ʌʌ //

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
            onClick={() => history.navigate(prevPageLink)}
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
