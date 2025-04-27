import { useEffect, useState, useTransition } from "react";
import { useSelector } from "react-redux";

import conversationService from "@services/conversationsService";
import usersService from "@services/usersService";

import ChatList from "@components/search/lists/ChatList";
import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import SearchedUser from "@components/search/elements/SearchedUser";

import { selectConversationsEntities } from "@store/values/Conversations";

export default function SearchBlock({
  searchText,
  selectedUsers,
  clearInputText,
  addUserToArray,
  removeUserFromArray,
  isMaxLimit,
  customClassName = "",
  isClickDisabledFunc = () => false,
  isSelectUserToArray = false,
  isClearInputText = false,
  isPreviewUserProfile = false,
  isSearchOnlyUsers = false,
}) {
  const viewProperty = (v) => ({ display: v ? "flex" : "none" });

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
          keyword: text,
          limit: 5,
        });

        const sortedUsers = users.sort((a, b) => {
          const lenDiff = a.login.length - b.login.length;

          if (lenDiff !== 0) return lenDiff;

          return a.login.localeCompare(b.login);
        });

        setSearchedUsers(sortedUsers);
        setIsUserSearched(
          sortedUsers.length ? null : "We couldn't find the specified users."
        );

        if (isSearchOnlyUsers) {
          return;
        }

        const conversationIds = await conversationService.search({
          name: text,
          limit: 10,
        });
        const existingConversations = conversationIds.reduce((chats, id) => {
          const chat = conversations[id];
          if (chat) chats.push(chat);
          return chats;
        }, []);

        setSearchedChats(existingConversations);
        setIsChatSearched(
          existingConversations.length
            ? null
            : "We couldn't find the specified chats."
        );
      }
    });
  };

  return (
    <div
      className={`h-[80svh] flex-1 mt-[5px] flex items-center justify-center max-xl:w-full max-xl:mt-[0px] max-xl:rounded-[16px] max-xl:bg-(--color-bg-light) ${customClassName}`}
      style={viewProperty(searchText)}
    >
      {searchText?.length < 2 ? null : (
        <CustomScrollBar
          customClassName="w-[400px] max-xl:!w-full"
          childrenClassName="flex flex-col gap-[5px]"
        >
          {isSearchOnlyUsers ? null : (
            <div className="py-[6px] px-[18px] my-[3px] text-black text-p rounded-[8px] bg-(--color-hover-light)">
              Users
            </div>
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
          <p className="text-h6 text-(--color-text-dark) text-center">
            {isUserSearched}
          </p>
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
