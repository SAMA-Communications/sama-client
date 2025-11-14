import InfiniteScroll from "react-infinite-scroll-component";
import { domMax, LayoutGroup, LazyMotion } from "motion/react";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import api from "@api/api.js";

import conversationService from "@services/conversationsService.js";

import ConversationItem from "@components/hub/chatList/ConversationItem";

import store from "@store/store.js";
import { getConverastionById } from "@store/values/Conversations";
import { insertChats } from "@store/values/Conversations.js";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";

import { getLastMessageUserName, getUserFullName } from "@utils/UserUtils.js";
import { navigateTo } from "@utils/NavigationUtils.js";

export default function ConversationItemList({
  conversations,
  additionalOnClickfunc,
  isHideDeletedUsers = false,
}) {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const activeConversationId = selectedConversation?._id;

  const convItemOnClickFunc = (id) => {
    dispatch(setSelectedConversation({ id }));
    navigateTo(`/#${id}`);
    additionalOnClickfunc && additionalOnClickfunc(id);
  };

  const needToGetMoreChats = useRef(true);
  const lastConversationRef = useCallback(() => {
    if (conversations.length === 0) return;
    api
      .conversationList({
        updated_at: { lt: conversations[conversations.length - 1].updated_at },
      })
      .then((chats) => {
        if (!chats.length) {
          needToGetMoreChats.current = false;
          return;
        }
        needToGetMoreChats.current = !(chats.length < 10);
        store.dispatch(
          insertChats(chats.map((obj) => ({ ...obj, participants: [] })))
        );

        if (chats.length > 0)
          conversationService.getAndStoreParticipantsFromChats(chats);
      });
  }, [conversations, needToGetMoreChats]);

  return (
    <InfiniteScroll
      dataLength={conversations.length}
      next={lastConversationRef}
      hasMore={true && needToGetMoreChats.current}
      scrollableTarget="conversationItemsScrollable"
    >
      <LazyMotion features={domMax}>
        <LayoutGroup id="conversationItemListLayoutGroup">
          {conversations.map((obj) => {
            const isSelected = activeConversationId === obj._id;
            const isGroup = obj.type === "g";
            const chatParticipantId =
              obj.owner_id === currentUserId ? obj.opponent_id : obj.owner_id;
            const chatParticipant = participants[chatParticipantId] || {};
            const chatName = obj.name || getUserFullName(chatParticipant);

            if (isHideDeletedUsers && !chatName) return null;

            const showLastMsgUser = isGroup;
            //!obj.last_message?.x replace with better checker for event message
            const lastMessageUserId = obj?.last_message?.from;
            const lastMessageUser = participants[lastMessageUserId] || {};
            const lastMessageUserName = showLastMsgUser
              ? currentUserId === lastMessageUserId
                ? "You"
                : getLastMessageUserName(lastMessageUser)
              : null;

            const avatarUrl = isGroup
              ? obj.image_url
              : chatParticipant.avatar_url;
            const avatarBlurHash = isGroup
              ? obj.image_object?.file_blur_hash
              : chatParticipant.avatar_object?.file_blur_hash;

            return (
              <ConversationItem
                key={obj._id}
                isSelected={isSelected}
                onClickFunc={() => convItemOnClickFunc(obj._id)}
                chatName={chatName}
                lastMessageUserName={lastMessageUserName}
                chatAvatarUrl={avatarUrl}
                chatAvatarBlutHash={avatarBlurHash}
                chatObject={obj}
                currentUserId={currentUserId}
              />
            );
          })}
        </LayoutGroup>
      </LazyMotion>
    </InfiniteScroll>
  );
}
