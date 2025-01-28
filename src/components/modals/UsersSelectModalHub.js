import ChatNameInput from "@components/modals/components/ChatNameInput";
import UserSelectorBlock from "@components/modals/components/UserSelectorBlock";
import conversationService from "@services/conversationsService";
import navigateTo from "@utils/navigation/navigate_to";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import removeAndNavigateSubLink from "@utils/navigation/remove_prefix";
import { KEY_CODES } from "@helpers/keyCodes";
import { getConverastionById } from "@store/values/Conversations";
import { selectParticipantsEntities } from "@store/values/Participants";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import "@styles/modals/UsersSelectModalHub.css";

export default function UsersSelectModalHub({ type, isEncrypted = false }) {
  const selectedConversation = useSelector(getConverastionById);
  const participants = useSelector(selectParticipantsEntities);

  const { pathname, hash } = useLocation();
  const [chatName, setChatName] = useState(null);
  const [chatImage, setChatImage] = useState(null);

  const sendCreateRequest = async (participants) => {
    if (!isEncrypted) {
      const chatId = await conversationService.createGroupChat(
        participants,
        chatName,
        chatImage
      );
      chatId && navigateTo(`/#${chatId}`);
      return;
    }

    const opponent = participants?.[0];
    const chatId = await conversationService.createPrivateChat(
      opponent.native_id,
      opponent,
      true
    );

    navigateTo(`/#${chatId}`);
  };

  const sendEditRequest = async (participants) => {
    if ((await conversationService.addParticipants(participants)) === false) {
      return;
    }
    removeAndNavigateLastSection(pathname + hash);
  };

  const closeModal = () =>
    removeAndNavigateSubLink(
      pathname + hash,
      isEncrypted ? "/create_encrypted" : "/create"
    );

  useKeyDown(KEY_CODES.ESCAPE, closeModal);

  const typeOfFunc = useMemo(() => {
    if (type === "add_participants") {
      return (
        <UserSelectorBlock
          closeWindow={() => removeAndNavigateLastSection(pathname + hash)}
          initSelectedUsers={selectedConversation.participants?.map(
            (uId) => participants[uId] || { _id: uId }
          )}
          onClickCreateFunc={sendEditRequest}
        />
      );
    }

    return chatName || isEncrypted ? (
      <UserSelectorBlock
        closeWindow={closeModal}
        isEncrypted={isEncrypted}
        onClickCreateFunc={sendCreateRequest}
      />
    ) : (
      <ChatNameInput
        setState={setChatName}
        setImage={setChatImage}
        closeWindow={closeModal}
      />
    );
  }, [type, chatName, isEncrypted, selectedConversation, participants]);

  return (
    <div className="edit-modal__container fcc">
      <div
        className={`edit-modal__content--chat${
          chatName || type || isEncrypted ? "" : "name"
        }`}
      >
        {typeOfFunc}
      </div>
    </div>
  );
}
