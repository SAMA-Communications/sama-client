import api from "../../../api/api";
import showCustomAlert from "../../../utils/show_alert";
import { clearSelectedConversation } from "../../../store/SelectedConversation";
import { getConverastionById, removeChat } from "../../../store/Conversations";
import { history } from "../../../_helpers/history";
import { useDispatch, useSelector } from "react-redux";

import "../../../styles/pages/chat/ChatInfoPage.css";

import { ReactComponent as TrashCan } from "./../../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as BackBtn } from "./../../../assets/icons/chatForm/BackBtn.svg";

export default function ChatInfoPage() {
  const dispatch = useDispatch();

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation?._id;

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
    <div className="chat-options-bg">
      <div className="chat-options-container">
        <div className="co-navigation">
          <div className="co-close" onClick={() => history.navigate("/main")}>
            <BackBtn />
          </div>
          <div>
            <div className="co-edit"></div>
            <div className="co-delete" onClick={deleteChat}>
              <TrashCan />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
