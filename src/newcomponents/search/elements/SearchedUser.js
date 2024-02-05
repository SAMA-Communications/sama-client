import getUserFullName from "@utils/user/get_user_full_name";
import getUserInitials from "@utils/user/get_user_initials";
import { addUsers } from "@store/values/Participants";
import { insertChat } from "@store/values/Conversations";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import "@newstyles/search/elements/SearchedUser.css";
import api from "@api/api";

export default function SearchedUser({ uObject }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const createChat = async (uId) => {
    if (!uId) {
      return;
    }

    const requestData = {
      type: "u",
      participants: [uId],
    };

    const chat = await api.conversationCreate(requestData);
    const users = await api.getParticipantsByCids({ cids: [chat._id] });
    dispatch(addUsers(users));
    dispatch(insertChat({ ...chat, messagesIds: [] }));

    navigate(`/main/#${chat._id}`);
    dispatch(setSelectedConversation({ id: chat._id }));
  };
  return (
    <div
      className="searched-user fcc"
      onClick={() => {
        createChat(uObject._id);
      }}
    >
      <div className="searched-user__photo fcc">{getUserInitials(uObject)}</div>
      <p className="searched-user__name">{getUserFullName(uObject)}</p>
    </div>
  );
}
