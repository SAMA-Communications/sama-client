import ConversationItem from "@components/hub/elements/ConversationItem";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import usersService from "@services/usersService";
import { getConverastionById } from "@store/values/Conversations";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch, useSelector } from "react-redux";
import { useMemo } from "react";

export default function ConversationItemList({ conversations }) {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(selectCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const activeConversationId = selectedConversation?._id;

  const mappedConversations = useMemo(() => {
    const needToUploadAvatar = {};

    const convItemOnClickFunc = (id) => {
      dispatch(setSelectedConversation({ id }));
      navigateTo(`/#${id}`);
    };

    const conversationArray = conversations.map((obj) => {
      const isSelected = activeConversationId === obj._id;
      const chatParticipantId =
        obj.owner_id === currentUser._id ? obj.opponent_id : obj.owner_id;
      const chatParticipant = participants[chatParticipantId] || {};
      const chatName = obj.name || getUserFullName(chatParticipant);

      const { avatar_url, avatar_object, _id: userId } = chatParticipant;
      if (avatar_object && !avatar_url) {
        needToUploadAvatar[avatar_object.file_id] = {
          _id: userId,
          ...avatar_object,
        };
      }

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
          currentUserId={currentUser._id}
        />
      );
    });

    if (Object.keys(needToUploadAvatar).length) {
      usersService.uploadAvatarsUrls(needToUploadAvatar);
    }

    return conversationArray;
  }, [activeConversationId, conversations, currentUser, participants]);

  return mappedConversations;
}
