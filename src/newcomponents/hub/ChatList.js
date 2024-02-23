import ConversationItem from "@newcomponents/hub/elements/ConversationItem.js";
import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import React, { useMemo, useState } from "react";
import SearchBlock from "@newcomponents/search/SearchBlock";
import SearchInput from "@newcomponents/static/SearchBar";
import getUserFullName from "@utils/user/get_user_full_name";
import {
  getConverastionById,
  selectAllConversations,
} from "@store/values/Conversations.js";
import { getCurrentUser } from "@store/values/CurrentUser";
import { selectParticipantsEntities } from "@store/values/Participants.js";
import { setSelectedConversation } from "@store/values/SelectedConversation.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import "@newstyles/hub/ChatList.css";

export default function ChatList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [inputText, setInputText] = useState(null);

  const conversations = useSelector(selectAllConversations);
  const participants = useSelector(selectParticipantsEntities);
  const currentUser = useSelector(getCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const chatsList = useMemo(
    () =>
      conversations
        .filter((obj) => obj.type === "g" || obj.last_message)
        .map((obj) => (
          <ConversationItem
            key={obj._id}
            isSelected={activeConv === obj._id}
            onClickFunc={() => {
              dispatch(setSelectedConversation({ id: obj._id }));
              navigate(`/#${obj._id}`);
            }}
            chatName={
              obj.name ||
              getUserFullName(
                participants[
                  obj[
                    obj.owner_id === currentUser._id
                      ? "opponent_id"
                      : "owner_id"
                  ]
                ] || {}
              )
            }
            chatObject={obj}
            currentUserId={currentUser._id}
          />
        )),
    [conversations, participants, activeConv, currentUser]
  );

  return (
    <div className="chat-list__container">
      <SearchInput shadowText={"Search"} setState={setInputText} />
      {inputText ? (
        <SearchBlock
          searchText={inputText}
          isClearInputText={true}
          clearInputText={() => setInputText(null)}
        />
      ) : (
        <CustomScrollBar>
          {chatsList.length ? (
            chatsList
          ) : (
            <p className="chat-list__empty">No chats are available.</p>
          )}
        </CustomScrollBar>
      )}
    </div>
  );
}
