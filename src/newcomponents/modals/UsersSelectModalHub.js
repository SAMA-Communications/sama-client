import ChatNameInput from "./components/ChatNameInput";
import UserSelectorBlock from "@newcomponents/modals/components/UserSelectorBlock";
import conversationService from "@services/conversationsService";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { getConverastionById } from "@store/values/Conversations";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import "@newstyles/modals/UsersSelectModalHub.css";

export default function UsersSelectModalHub({ type }) {
  const selectedConversation = useSelector(getConverastionById);
  const participants = useSelector(selectParticipantsEntities);

  const { pathname, hash } = useLocation();
  const [chatName, setChatName] = useState(null);

  const closeModal = () => removeAndNavigateSubLink(pathname + hash, "/create");

  const sendCreateRequest = async (participants) => {
    await conversationService.createGroupChat(participants, chatName);
  };

  const sendEditRequest = async (participants) => {
    await conversationService.addParticipants(participants);
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
          onClickCreateFunc={sendEditRequest}
        />
      );
    }

    return chatName ? (
      <UserSelectorBlock
        closeWindow={closeModal}
        onClickCreateFunc={sendCreateRequest}
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
