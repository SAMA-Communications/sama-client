import ChatNameInput from "./components/ChatNameInput";
import UserSelectorBlock from "@newcomponents/modals/components/UserSelectorBlock";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import showCustomAlert from "@utils/show_alert";
import {
  addUsers,
  selectAllParticipants,
  selectParticipantsEntities,
} from "@store/values/Participants";
import { getConverastionById, insertChat } from "@store/values/Conversations";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";

import "@newstyles/modals/UsersSelectModalHub.css";
import api from "@api/api";

export default function UsersSelectModalHub({ type }) {
  const dispatch = useDispatch();

  const selectedConversation = useSelector(getConverastionById);
  const participants = useSelector(selectParticipantsEntities);

  const { pathname, hash } = useLocation();
  const [chatName, setChatName] = useState(null);

  const closeModal = () => removeAndNavigateSubLink(pathname + hash, "/create");

  const sendChatCreateRequest = async (participants) => {
    if (!participants.length || !chatName) {
      showCustomAlert("Choose participants.", "warning");
      return;
    }

    const chat = await api.conversationCreate({
      type: "g",
      name: chatName,
      participants: participants.map((el) => el._id),
    });

    dispatch(addUsers(participants));
    dispatch(insertChat({ ...chat, messagesIds: null }));

    navigateTo(`/#${chat._id}`);
    dispatch(setSelectedConversation({ id: chat._id }));
  };

  const sendAddParticipantsRequest = async (participants) => {
    if (!participants.length) {
      return;
    }

    const addUsersArr = participants.map((el) => el._id);
    const requestData = {
      cid: selectedConversation._id,
      participants: { add: addUsersArr },
    };

    if (
      !window.confirm(
        `Add selected user${participants.length > 1 ? "s" : ""} to the chat?`
      )
    ) {
      return;
    }

    await api.conversationUpdate(requestData);
    removeAndNavigateLastSection(pathname + hash);
  };

  const typeOfFunc = useMemo(() => {
    if (type === "add_participants") {
      return (
        <UserSelectorBlock
          closeWindow={() => removeAndNavigateLastSection(pathname + hash)}
          initSelectedUsers={selectedConversation.participants.map(
            (uId) => participants[uId]
          )}
          onClickCreateFunc={sendAddParticipantsRequest}
        />
      );
    }

    return chatName ? (
      <UserSelectorBlock
        closeWindow={closeModal}
        onClickCreateFunc={sendChatCreateRequest}
      />
    ) : (
      <ChatNameInput setState={setChatName} closeWindow={closeModal} />
    );
  }, [type, chatName]);

  return (
    <div className="edit-modal__container fcc">
      <div
        className={`edit-modal__content--chat${chatName || type ? "" : "name"}`}
      >
        {typeOfFunc}
      </div>
    </div>
  );
}
