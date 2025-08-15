import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
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
  additionalOnClickfunc,
  isSelectUserToArray = false,
  isClearInputText = false,
  isPreviewUserProfile = false,
  isSearchOnlyUsers = false,
  isShowDefaultConvs = false,
  isHideDeletedUsers = false,
  isClickDisabledFunc = () => false,
}) {
  const conversations = useSelector(selectConversationsEntities);

  const [isPending, startTransition] = useTransition();
  const [defaultChats, setDefaultChats] = useState([]);
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [searchedChats, setSearchedChats] = useState([]);
  const [isUserSearched, setIsUserSearched] = useState(null);
  const [isChatSearched, setIsChatSearched] = useState(null);

  useEffect(() => {
    if (searchText?.length < 1) {
      setSearchedUsers([]);
      setIsUserSearched(null);
    }
    const debounce = setTimeout(() => sendSearchRequest(searchText), 300);
    return () => clearTimeout(debounce);
  }, [searchText]);

  useEffect(() => {
    if (!isShowDefaultConvs) return;
    setDefaultChats(
      Object.values(conversations)
        .filter((el) => el.last_message || el.type === "g")
        .sort((a, b) => Date.parse(b.updated_at) - Date.parse(a.updated_at))
        .slice(0, 20)
    );
  }, [isShowDefaultConvs]);

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
    <m.div
      className={`mt-[5px] flex items-center justify-center max-xl:w-full max-xl:mt-[0px] max-xl:rounded-[16px] max-xl:bg-(--color-bg-light) ${customClassName}`}
      initial={{ height: "0svh" }}
      animate={{ height: ["0svh", "100%"] }}
      exit={{ height: "0svh" }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <CustomScrollBar
        customClassName="w-[400px] max-xl:!w-full"
        childrenClassName="flex flex-col gap-[5px] !overflow-x-hidden"
      >
        {isShowDefaultConvs && !searchText?.length ? (
          <ChatList
            conversations={defaultChats}
            isShowTitle={false}
            isHideDeletedUsers={isHideDeletedUsers}
            additionalOnClickfunc={additionalOnClickfunc}
          />
        ) : (
          <>
            {isSearchOnlyUsers ? null : (
              <div className="py-[6px] px-[18px] my-[3px] text-black text-p rounded-[8px] bg-(--color-hover-light)">
                Users
              </div>
            )}
            {isUserSearched ? (
              <m.p
                className="text-h6 text-(--color-text-dark) text-center"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { dealy: 0.4, duration: 0.2 },
                }}
                exit={{ opacity: 0 }}
              >
                {isUserSearched}
              </m.p>
            ) : null}
            <AnimatePresence>
              {searchedUsers.map((u, index) => {
                const isSelected = selectedUsers?.some(
                  (uObj) => uObj._id === u._id
                );
                const isClickDisabled = isMaxLimit
                  ? isClickDisabledFunc(u) || !isSelected
                  : isClickDisabledFunc(u) && isSelected;

                return (
                  <SearchedUser
                    key={u._id}
                    index={index}
                    uObject={u}
                    isSelected={isSelected}
                    isClickDisabled={isClickDisabled}
                    clearInputText={clearInputText}
                    addUserToArray={addUserToArray}
                    removeUserFromArray={removeUserFromArray}
                    isClearInputText={isClearInputText}
                    isSelectUserToArray={isSelectUserToArray}
                    isPreviewUserProfile={isPreviewUserProfile}
                    additionalOnClickfunc={additionalOnClickfunc}
                  />
                );
              })}
            </AnimatePresence>
            {isSearchOnlyUsers ? null : (
              <ChatList
                conversations={searchedChats}
                isChatSearched={isChatSearched}
                isHideDeletedUsers={isHideDeletedUsers}
                additionalOnClickfunc={additionalOnClickfunc}
              />
            )}
          </>
        )}
      </CustomScrollBar>
    </m.div>
  );
}
