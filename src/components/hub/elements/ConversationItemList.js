import ConversationItem from "@components/hub/elements/ConversationItem";
import getLastMessageUserName from "@utils/user/get_last_message_user_name";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import { getConverastionById } from "@store/values/Conversations";
import { selectCurrentUserId } from "@store/values/CurrentUserId";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
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

  return conversations.map((obj) => {
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
        lastMessageUserName={obj.type === "g" ? lastMessageUserName : null}
        chatAvatarUrl={chatParticipant.avatar_url}
        chatAvatarBlutHash={chatParticipant.avatar_object?.file_blur_hash}
        chatObject={obj}
        currentUserId={currentUserId}
      />
    );
  });
}
