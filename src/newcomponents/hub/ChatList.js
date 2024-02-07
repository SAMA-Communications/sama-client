import ChatBox from "@newcomponents/hub/elements/ChatBox.js";
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
  const currentuser = useSelector(getCurrentUser);
  const selectedConversation = useSelector(getConverastionById);
  const activeConv = selectedConversation?._id;

  const chatsList = useMemo(
    () =>
      conversations.map((obj) =>
        obj.type === "g" || obj.last_message ? (
          <ChatBox
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
                    obj.owner_id === currentuser._id
                      ? "opponent_id"
                      : "owner_id"
                  ]
                ] || {}
              )
            }
            chatObject={obj}
            currentUserId={currentuser._id}
          />
        ) : null
      ),
    [conversations, participants, activeConv]
  );

  return (
    <div className="chat-list__container">
      <SearchInput shadowText={"Search"} setState={setInputText} />
      {inputText ? (
        <SearchBlock searchText={inputText} />
      ) : (
        <CustomScrollBar>{chatsList}</CustomScrollBar>
      )}
    </div>
  );
}
