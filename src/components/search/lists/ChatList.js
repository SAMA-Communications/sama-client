import ConversationItem from "@components/hub/elements/ConversationItem";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import { getConverastionById } from "@store/values/Conversations";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";

export default function ChatList({
  conversations,
  isShowTitle = true,
  isChatSearched,
}) {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(selectCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const activeConversationId = selectedConversation?._id;

  return (
    <>
      {isShowTitle ? <div className="search__list-title">Chats</div> : null}
      {conversations.map((obj) => {
        const isSelected = activeConversationId === obj._id;
        const chatParticipantId =
          obj.owner_id === currentUser._id ? obj.opponent_id : obj.owner_id;
        const chatParticipant = participants[chatParticipantId] || {};
        const chatName = obj.name || getUserFullName(chatParticipant);

        const onClickFunc = () => {
          dispatch(setSelectedConversation({ id: obj._id }));
          navigateTo(`/#${obj._id}`);
        };

        return (
          <ConversationItem
            key={obj._id}
            isSelected={isSelected}
            onClickFunc={onClickFunc}
            chatName={chatName}
            chatObject={obj}
            currentUserId={currentUser._id}
          />
        );
      })}
      <p className="search__text">{isChatSearched}</p>
    </>
  );
}
