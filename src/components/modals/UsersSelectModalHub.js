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

export default function UsersSelectModalHub({ type }) {
  const selectedConversation = useSelector(getConverastionById);
  const participants = useSelector(selectParticipantsEntities);

  const { pathname, hash } = useLocation();
  const [chatName, setChatName] = useState(null);

  const closeModal = () => removeAndNavigateSubLink(pathname + hash, "/create");

  const sendCreateRequest = async (participants) => {
    const chatId = await conversationService.createGroupChat(
      participants,
      chatName
    );
    chatId && navigateTo(`/#${chatId}`);
  };

  const sendEditRequest = async (participants) => {
    if ((await conversationService.addParticipants(participants)) === false) {
      return;
    }
    removeAndNavigateLastSection(pathname + hash);
  };

  useKeyDown(KEY_CODES.ESCAPE, () =>
    removeAndNavigateSubLink(pathname + hash, "/create")
  );

  const typeOfFunc = useMemo(() => {
    if (type === "add_participants") {
      return (
        <UserSelectorBlock
          closeWindow={() => removeAndNavigateLastSection(pathname + hash)}
          initSelectedUsers={selectedConversation.participants
            ?.map((uId) => participants[uId])
            ?.filter((el) => !!el)}
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
  }, [type, chatName, selectedConversation, participants]);

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
