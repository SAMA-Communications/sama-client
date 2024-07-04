import ConversationItem from "@components/hub/elements/ConversationItem";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import { getConverastionById } from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

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

  const mappedConversations = useMemo(
    () =>
      conversations.map((obj) => {
        const isSelected = activeConversationId === obj._id;
        const chatParticipantId =
          obj.owner_id === currentUserId ? obj.opponent_id : obj.owner_id;
        const chatParticipant = participants[chatParticipantId] || {};
        const chatName = obj.name || getUserFullName(chatParticipant);

        return (
          <ConversationItem
            key={obj._id}
            isSelected={isSelected}
            onClickFunc={() => convItemOnClickFunc(obj._id)}
            chatName={chatName}
            chatAvatarObject={{
              ...chatParticipant.avatar_object,
              avatar_url: chatParticipant.avatar_url,
            }}
            chatObject={obj}
            currentUserId={currentUserId}
          />
        );
      }),
    [activeConversationId, conversations, currentUserId, participants]
  );

  return mappedConversations;
}
