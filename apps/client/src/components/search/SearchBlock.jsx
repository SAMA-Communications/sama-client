import { useCallback, useEffect, useRef } from "react";

import { useLocation } from "react-router";

import { useDispatch, useSelector } from "react-redux";

import { useSearchBlock } from "@hooks/components/useSearchBlock";

import { setAdapters, SearchBlock as UISearchBlock } from "@sama-communications.ui-kit";

import conversationService from "@services/conversationsService";

import { getConverastionById } from "@store/values/Conversations";
import { addUsers } from "@store/values/Participants";
import { setSelectedConversation } from "@store/values/SelectedConversation";

import { addSuffix, navigateTo } from "@utils/NavigationUtils.js";

const initialSearchData = {
  searchedUsers: [],
  searchedChats: [],
  defaultChats: [],
  isUserSearched: null,
  isChatSearched: null,
  isPending: false,
};

export default function SearchBlock({
  searchText,
  selectedUsers = [],
  clearInputText,
  addUserToArray,
  removeUserFromArray,
  isMaxLimit = false,
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
  const dispatch = useDispatch();
  const { pathname, hash } = useLocation();
  const selectedConversation = useSelector(getConverastionById);

  const searchData = useSearchBlock(searchText, {
    isSearchOnlyUsers,
    isShowDefaultConvs,
  });

  const searchDataRef = useRef(initialSearchData);
  searchDataRef.current = searchData;

  useEffect(() => {
    setAdapters({
      getSearchBlockData: () => searchDataRef.current,
    });
  }, []);

  const handleUserClick = useCallback(
    async (user) => {
      if (isPreviewUserProfile) {
        dispatch(addUsers([user]));
        addSuffix(pathname + hash, `/user?uid=${user._id}&view=card`);
        return;
      }
      const chatId = await conversationService.createPrivateChat(user._id, user);
      navigateTo(`/#${chatId}`);
      additionalOnClickfunc?.(chatId);
    },
    [dispatch, pathname, hash, isPreviewUserProfile, additionalOnClickfunc],
  );

  const handleConversationClick = useCallback(
    (cid) => {
      dispatch(setSelectedConversation({ id: cid }));
      navigateTo(`/#${cid}`);
      additionalOnClickfunc?.(cid);
    },
    [dispatch, additionalOnClickfunc],
  );

  return (
    <UISearchBlock
      customClassName={customClassName}
      isClearInputText={isClearInputText}
      isClickDisabledFunc={isClickDisabledFunc}
      isMaxLimit={isMaxLimit}
      isSearchOnlyUsers={isSearchOnlyUsers}
      isSelectUserToArray={isSelectUserToArray}
      isShowDefaultConvs={isShowDefaultConvs}
      onAddUser={addUserToArray ?? (() => {})}
      onClearInputText={clearInputText}
      onConversationClick={handleConversationClick}
      onRemoveUser={removeUserFromArray ?? (() => {})}
      onUserClick={!isSelectUserToArray ? handleUserClick : undefined}
      searchOptions={{ isSearchOnlyUsers, isShowDefaultConvs }}
      searchText={searchText ?? null}
      selectedConversationId={selectedConversation?._id}
      selectedUsers={selectedUsers}
    />
  );
}
