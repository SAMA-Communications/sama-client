import ConversationItem from "@components/hub/elements/ConversationItem";
import getUserFullName from "@src/utils/user/get_user_full_name";
import navigateTo from "@src/utils/navigation/navigate_to";
import { getConverastionById } from "@src/store/values/Conversations";
import { selectCurrentUser } from "@src/store/values/CurrentUser";
import { selectParticipantsEntities } from "@src/store/values/Participants";
import { setSelectedConversation } from "@src/store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";

export default function ConversationItemList({ conversations }) {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(selectCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const activeConversationId = selectedConversation?._id;

  const convItemOnClickFunc = (id) => {
    dispatch(setSelectedConversation({ id }));
    navigateTo(`/#${id}`);
  };

  return conversations.map((obj) => {
    const isSelected = activeConversationId === obj._id;
    const chatParticipantId =
      obj.owner_id === currentUser._id ? obj.opponent_id : obj.owner_id;
    const chatParticipant = participants[chatParticipantId] || {};
    const chatName = obj.name || getUserFullName(chatParticipant);

    return (
      <ConversationItem
        key={obj._id}
        isSelected={isSelected}
        onClickFunc={() => convItemOnClickFunc(obj._id)}
        chatName={chatName}
        chatObject={obj}
        currentUserId={currentUser._id}
      />
    );
  });
}
