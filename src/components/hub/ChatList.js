import ConversationItem from "@components/hub/elements/ConversationItem.js";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";
import getUserFullName from "@utils/user/get_user_full_name";
import navigateTo from "@utils/navigation/navigate_to";
import {
  getConverastionById,
  selectAllConversations,
} from "@store/values/Conversations.js";
import { getIsMobileView } from "@src/store/values/IsMobileView";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants.js";
import { setSelectedConversation } from "@store/values/SelectedConversation.js";
import { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import "@styles/hub/ChatList.css";

import SChatList from "@skeletons/hub/SChatList";
import AccountInfo from "../info/elements/AccountInfo";

export default function ChatList() {
  const dispatch = useDispatch();

  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(selectCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const chatsList = useMemo(() => {
    if (!conversations) {
      return <SChatList />;
    }

    const filteredConversations = conversations.filter(
      (obj) => obj.type === "g" || obj.last_message
    );
    if (!filteredConversations.length) {
      return <p className="chat-list__empty">No chats are available.</p>;
    }

    return filteredConversations.map((obj) => (
      <ConversationItem
        key={obj._id}
        isSelected={activeConv === obj._id}
        onClickFunc={() => {
          dispatch(setSelectedConversation({ id: obj._id }));
          navigateTo(`/#${obj._id}`);
        }}
        chatName={
          obj.name ||
          getUserFullName(
            participants[
              obj[obj.owner_id === currentUser._id ? "opponent_id" : "owner_id"]
            ] || {}
          )
        }
        chatObject={obj}
        currentUserId={currentUser._id}
      />
    ));
  }, [conversations, participants, activeConv, currentUser]);

  return (
    <div className="chat-list__container">
      {isMobileView ? <AccountInfo /> : null}
      <SearchInput shadowText={"Search"} setState={setInputText} />
      {inputText ? (
        <SearchBlock
          searchText={inputText}
          isClearInputText={true}
          clearInputText={() => setInputText(null)}
        />
      ) : (
        <CustomScrollBar>{chatsList}</CustomScrollBar>
      )}
    </div>
  );
}
