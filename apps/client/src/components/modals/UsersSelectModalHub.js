import * as m from "motion/react-m";
import { useLocation } from "react-router";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";

import conversationService from "@services/conversationsService";
import { useKeyDown } from "@hooks/useKeyDown";

import ChatNameInput from "@components/modals/components/ChatNameInput";
import UserSelectorBlock from "@components/modals/components/UserSelectorBlock";

import { getConverastionById } from "@store/values/Conversations";
import { selectParticipantsEntities } from "@store/values/Participants";

import {
  navigateTo,
  removeAndNavigateSubLink,
  removeAndNavigateLastSection,
} from "@utils/NavigationUtils.js";
import { KEY_CODES } from "@utils/global/keyCodes";

export default function UsersSelectModalHub({ type }) {
  const selectedConversation = useSelector(getConverastionById);
  const participants = useSelector(selectParticipantsEntities);

  const { pathname, hash } = useLocation();
  const [chatName, setChatName] = useState(null);
  const [chatImage, setChatImage] = useState(null);

  const closeModal = () => removeAndNavigateSubLink(pathname + hash, "/create");

  const sendCreateRequest = async (participants) => {
    const chatId = await conversationService.createGroupChat(
      participants,
      chatName,
      chatImage
    );
    chatId && navigateTo(`/#${chatId}`);
  };

  const sendEditRequest = async (participants) => {
    if ((await conversationService.addParticipants(participants)) === false) {
      return;
    }
    removeAndNavigateLastSection(pathname + hash);
  };

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

    return chatName ? (
      <UserSelectorBlock
        closeWindow={closeModal}
        onClickCreateFunc={sendCreateRequest}
      />
    ) : (
      <ChatNameInput
        setState={setChatName}
        setImage={setChatImage}
        closeWindow={closeModal}
      />
    );
  }, [type, chatName, selectedConversation, participants]);

  useKeyDown(KEY_CODES.ESCAPE, () => closeModal);

  return (
    <m.div
      className="absolute top-[0px] w-dvw h-dvh bg-(--color-black-50) flex items-center justify-center z-10"
      initial={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      animate={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      exit={{ backgroundColor: "rgba(0, 0, 0, 0)" }}
      transition={{ duration: 0.2 }}
    >
      <m.div
        className={`p-[30px] flex flex-col gap-[20px] rounded-[32px] bg-(--color-bg-light) w-[min(460px,100%)] max-md:w-[94svw] max-md:p-[20px] ${
          chatName || type ? "h-[80svh]" : ""
        }`}
        key={
          type === "add_participants"
            ? "addParticipants"
            : chatName
            ? "userSelectorBlock"
            : "chatNameInput"
        }
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { delay: 0.1 } }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {typeOfFunc}
      </m.div>
    </m.div>
  );
}
