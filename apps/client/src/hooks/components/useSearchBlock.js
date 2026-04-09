import { useEffect, useState, useTransition } from "react";

import { useSelector } from "react-redux";

import conversationService from "@services/conversationsService";
import usersService from "@services/usersService";

import { selectConversationsEntities } from "@store/values/Conversations";

export function useSearchBlock(searchText, options = {}) {
  const { isSearchOnlyUsers = false, isShowDefaultConvs = false } = options;

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
    const debounce = setTimeout(() => {
      if (searchText?.length > 1) {
        startTransition(async () => {
          const users = await usersService.search({
            keyword: searchText,
            limit: 5,
          });
          const sortedUsers = (users || []).sort((a, b) => {
            const lenDiff = (a.login?.length ?? 0) - (b.login?.length ?? 0);
            if (lenDiff !== 0) return lenDiff;
            return (a.login ?? "").localeCompare(b.login ?? "");
          });
          setSearchedUsers(sortedUsers);
          setIsUserSearched(sortedUsers.length ? null : "We couldn't find the specified users.");

          if (isSearchOnlyUsers) {
            setSearchedChats([]);
            setIsChatSearched(null);
            return;
          }

          const conversationIds = await conversationService.search({
            name: searchText,
            limit: 10,
          });

          const mergedConversations = await conversationService.resolveConversationsByIds(conversationIds || []);
          setSearchedChats(mergedConversations);
          setIsChatSearched(mergedConversations.length ? null : "We couldn't find the specified chats.");
        });
      } else {
        setSearchedChats([]);
        setIsChatSearched(null);
      }
    }, 300);
    return () => clearTimeout(debounce);
  }, [searchText, isSearchOnlyUsers]);

  useEffect(() => {
    if (!isShowDefaultConvs || !conversations) return;
    setDefaultChats(
      Object.values(conversations)
        .filter((el) => el.last_message || el.type === "g")
        .sort((a, b) => Date.parse(b.updated_at || 0) - Date.parse(a.updated_at || 0))
        .slice(0, 20),
    );
  }, [isShowDefaultConvs, conversations]);

  return {
    searchedUsers,
    searchedChats,
    defaultChats,
    isUserSearched,
    isChatSearched,
    isPending,
  };
}
