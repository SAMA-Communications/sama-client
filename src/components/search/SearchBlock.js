import ChatList from "@components/search/lists/ChatList";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import OvalLoader from "@components/_helpers/OvalLoader";
import SearchedUser from "@components/search/elements/SearchedUser";
import conversationService from "@services/conversationsService";
import usersService from "@services/usersService";
import { selectConversationsEntities } from "@store/values/Conversations";
import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

import "@styles/search/SearchBlock.css";

export default function SearchBlock({
  searchText,
  selectedUsers,
  clearInputText,
  addUserToArray,
  removeUserFromArray,
  isMaxLimit,
  isClickDisabledFunc = () => false,
  isSelectUserToArray = false,
  isClearInputText = false,
  isPreviewUserProfile = false,
  isSearchOnlyUsers = false,
}) {
  const viewProperty = (v) => ({ display: v ? "block" : "none" });

  const conversations = useSelector(selectConversationsEntities);

  const [isPending, startTransition] = useTransition();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedChats, setSearchedChats] = useState([]);
  const [isUserSearched, setIsUserSearched] = useState(null);
  const [isChatSearched, setIsChatSearched] = useState(null);

  useEffect(() => {
    if (!searchText) {
      setSearchedUsers([]);
      setIsUserSearched(null);
    }
    const debounce = setTimeout(() => sendSearchRequest(searchText), 300);
    return () => clearTimeout(debounce);
  }, [searchText]);

  const sendSearchRequest = async (text) => {
    startTransition(async () => {
      if (text?.length > 1) {
        const users = await usersService.search({
          login: text,
          limit: 5,
        });
        setSearchedUsers(users);
        setIsUserSearched(
          users.length ? null : "We couldn't find the specified users."
        );

        if (isSearchOnlyUsers) {
          return;
        }

        const conversationIds = await conversationService.search({
          name: text,
          limit: 10,
        });
        setSearchedChats(
          conversationIds.reduce((chats, id) => {
            const chat = conversations[id];
            if (chat) chats.push(chat);
            return chats;
          }, [])
        );
        setIsChatSearched(
          conversationIds.length
            ? null
            : "We couldn't find the specified chats."
        );
      }
    });
  };

  return (
    <div className="search__container fcc" style={viewProperty(searchText)}>
      {isPending ? (
        <OvalLoader width={80} height={80} />
      ) : searchText?.length < 2 ? null : (
        <CustomScrollBar customStyle={{ width: "400px" }}>
          {isSearchOnlyUsers ? null : (
            <div className="search__list-title">Users</div>
          )}
          {searchedUsers.map((u) => {
            const isSelected = selectedUsers?.some(
              (uObj) => uObj._id === u._id
            );
            const isClickDisabled = isMaxLimit
              ? isClickDisabledFunc(u) || !isSelected
              : isClickDisabledFunc(u) && isSelected;

            return (
              <SearchedUser
                key={u._id}
                uObject={u}
                isSelected={isSelected}
                isClickDisabled={isClickDisabled}
                clearInputText={clearInputText}
                addUserToArray={addUserToArray}
                removeUserFromArray={removeUserFromArray}
                isClearInputText={isClearInputText}
                isSelectUserToArray={isSelectUserToArray}
                isPreviewUserProfile={isPreviewUserProfile}
              />
            );
          })}
          <p className="search__text">{isUserSearched}</p>
          {isSearchOnlyUsers ? null : (
            <ChatList
              conversations={searchedChats}
              isChatSearched={isChatSearched}
            />
          )}
        </CustomScrollBar>
      )}
    </div>
  );
}
