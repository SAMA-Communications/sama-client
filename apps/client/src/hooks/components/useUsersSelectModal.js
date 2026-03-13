import { useCallback, useState, useEffect } from "react";

import { useLocation } from "react-router";

import { useSelector } from "react-redux";

import conversationService from "@services/conversationsService";

import { getConverastionById } from "@store/values/Conversations";
import { selectParticipantsEntities } from "@store/values/Participants";

import { removeAndNavigateSubLink, removeAndNavigateLastSection, navigateTo } from "@utils/NavigationUtils.js";

export function useUsersSelectModal({ type } = {}) {
  const selectedConversation = useSelector(getConverastionById);
  const participants = useSelector(selectParticipantsEntities);
  const { pathname, hash } = useLocation();

  const initSelectedUsers =
    type === "add_participants" && selectedConversation?.participants
      ? selectedConversation.participants.map((uId) => participants[uId] || { _id: uId })
      : undefined;

  const [chatName, setChatName] = useState(null);
  const [chatImage, setChatImage] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState(initSelectedUsers ?? []);
  const [inputText, setInputText] = useState(null);

  useEffect(() => {
    if (initSelectedUsers?.length) {
      setSelectedUsers(initSelectedUsers);
    }
  }, [initSelectedUsers?.length]);

  const closeModal = useCallback(() => removeAndNavigateSubLink(pathname + hash, "/create"), [pathname, hash]);

  const closeAddParticipants = useCallback(() => removeAndNavigateLastSection(pathname + hash), [pathname, hash]);

  const sendCreateRequest = useCallback(
    async (users) => {
      const chatId = await conversationService.createGroupChat(users, chatName, chatImage);
      if (chatId) navigateTo(`/#${chatId}`);
    },
    [chatName, chatImage],
  );

  const sendEditRequest = useCallback(
    async (users) => {
      const success = await conversationService.addParticipants(users);
      if (success !== false) {
        removeAndNavigateLastSection(pathname + hash);
      }
    },
    [pathname, hash],
  );

  const addUser = useCallback((user) => {
    setSelectedUsers((prev) => {
      const exists = prev.some((u) => u._id === user._id);
      return exists ? prev : [...prev, user];
    });
  }, []);

  const removeUser = useCallback((user) => {
    setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
  }, []);

  return {
    type,
    chatName,
    setChatName,
    chatImage,
    setChatImage,
    selectedUsers,
    setSelectedUsers,
    inputText,
    setInputText,
    closeModal,
    closeAddParticipants,
    sendCreateRequest,
    sendEditRequest,
    initSelectedUsers,
    addUser,
    removeUser,
  };
}
