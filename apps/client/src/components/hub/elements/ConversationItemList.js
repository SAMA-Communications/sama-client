import ConversationItem from "@components/hub/elements/ConversationItem";
import InfiniteScroll from "react-infinite-scroll-component";
import api from "@api/api.js";
import conversationService from "@services/conversationsService.js";
import getLastMessageUserName from "@utils/user/get_last_message_user_name";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import store from "@store/store.js";
import { getConverastionById } from "@store/values/Conversations";
import { insertChats } from "@store/values/Conversations.js";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ConversationItemList({ conversations }) {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const currentUserId = useSelector(selectCurrentUserId);
  const selectedConversation = useSelector(getConverastionById);
  const activeConversationId = selectedConversation?._id;

  const convItemOnClickFunc = (id) => {
    dispatch(setSelectedConversation({ id }));
    navigateTo(`/#${id}`);
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
      {conversations.map((obj) => {
        const isSelected = activeConversationId === obj._id;
        const chatParticipantId =
          obj.owner_id === currentUserId ? obj.opponent_id : obj.owner_id;
        const chatParticipant = participants[chatParticipantId] || {};
        const chatName = obj.name || getUserFullName(chatParticipant);

        const lastMessageUserId = obj?.last_message?.from;
        const lastMessageUser = participants[lastMessageUserId] || {};
        const lastMessageUserName =
          currentUserId === lastMessageUserId
            ? "You"
            : getLastMessageUserName(lastMessageUser);

        return (
          <ConversationItem
            key={obj._id}
            isSelected={isSelected}
            onClickFunc={() => convItemOnClickFunc(obj._id)}
            chatName={chatName}
            lastMessageUserName={
              obj.type === "g" && !obj.last_message?.x
                ? lastMessageUserName
                : null
            }
            chatAvatarUrl={
              obj.type === "g" ? obj.image_url : chatParticipant.avatar_url
            }
            chatAvatarBlutHash={
              obj.type === "g"
                ? obj.image_object?.file_blur_hash
                : chatParticipant.avatar_object?.file_blur_hash
            }
            chatObject={obj}
            currentUserId={currentUserId}
          />
        );
      })}
    </InfiniteScroll>
  );
}
