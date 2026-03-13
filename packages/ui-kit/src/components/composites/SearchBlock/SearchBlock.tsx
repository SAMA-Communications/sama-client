import { clsx } from "clsx";
import { Users } from "lucide-react";
import type { User } from "types/samaWssModels";

import { getAdapters } from "@adapters";

import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";
import type { SearchBlockProps } from "@composites/SearchBlock/SearchBlock.types";
import { SearchConversationList } from "@composites/SearchConversationList";

import { SearchedUser } from "@elements/SearchedUser";
import { WrapperRoot } from "@elements/WrapperRoot";

import { EMPTY_SEARCH_BLOCK_DATA } from "@utils/constants";

export const SearchBlock = (props: SearchBlockProps) => {
  const {
    searchText: searchTextProp,
    searchOptions,
    searchedUsers: searchedUsersProp,
    searchedChats: searchedChatsProp,
    defaultChats: defaultChatsProp,
    isShowDefaultConvs,
    isSearchOnlyUsers,
    isUserSearched: isUserSearchedProp,
    isChatSearched: isChatSearchedProp,
    isPending: isPendingProp,
    selectedUsers,
    onAddUser,
    onRemoveUser,
    isClickDisabledFunc,
    isMaxLimit,
    onClearInputText,
    isClearInputText,
    onConversationClick,
    onUserClick,
    isSelectUserToArray,
    selectedConversationId,
    customClassName = "",
  } = props;

  const adapters = getAdapters();
  const useAdapterData = adapters.getSearchBlockData && searchTextProp !== undefined && searchOptions !== undefined;

  const adapterData = useAdapterData ? adapters.getSearchBlockData!() : null;
  const searchText = searchTextProp ?? null;

  const { searchedUsers, searchedChats, defaultChats, isUserSearched, isChatSearched, isPending } =
    useAdapterData && adapterData
      ? adapterData
      : {
          searchedUsers: searchedUsersProp ?? EMPTY_SEARCH_BLOCK_DATA.searchedUsers,
          searchedChats: searchedChatsProp ?? EMPTY_SEARCH_BLOCK_DATA.searchedChats,
          defaultChats: defaultChatsProp ?? EMPTY_SEARCH_BLOCK_DATA.defaultChats,
          isUserSearched: isUserSearchedProp ?? EMPTY_SEARCH_BLOCK_DATA.isUserSearched,
          isChatSearched: isChatSearchedProp ?? EMPTY_SEARCH_BLOCK_DATA.isChatSearched,
          isPending: isPendingProp ?? EMPTY_SEARCH_BLOCK_DATA.isPending,
        };
  const handleUserClick = (user: User) => {
    if (isSelectUserToArray) {
      const isSelected = selectedUsers.some((u) => u._id === user._id);
      const disabled = isClickDisabledFunc?.(user) ?? false;
      if (disabled) return;
      isClearInputText && onClearInputText?.();
      if (isSelected) {
        onRemoveUser(user);
      } else {
        onAddUser(user);
      }
    } else {
      isClearInputText && onClearInputText?.();
      onUserClick?.(user);
    }
  };

  return (
    <WrapperRoot
      className={clsx(
        "ui:mt-[5px] ui:flex ui:items-center ui:justify-center ui:max-xl:mt-0 ui:max-xl:w-full ui:max-xl:rounded-[16px] ui:max-xl:bg-bg-light",
        customClassName,
      )}
    >
      <CustomVerticalScrollbar
        customClassName="ui:w-[400px]! ui:min-h-0 ui:max-xl:w-full!"
        childrenClassName="ui:flex ui:flex-col ui:px-1 ui:!overflow-x-hidden"
      >
        {isShowDefaultConvs && !searchText?.length ? (
          <SearchConversationList
            conversations={defaultChats}
            showTitle={false}
            selectedConversationId={selectedConversationId}
            onConversationClick={(cid) => onConversationClick?.(cid)}
          />
        ) : (
          <>
            {!isSearchOnlyUsers ? (
              <div className="ui:mx-2 ui:my-0.5 ui:flex ui:items-center ui:gap-1.75 ui:rounded-xl ui:bg-bg-dark/5 ui:p-2 ui:text-sm ui:text-text-dark">
                <Users size={18} /> Users
              </div>
            ) : null}
            {isUserSearched ? <p className="ui:py-2 ui:text-center ui:text-text-dark">{isUserSearched}</p> : null}
            {searchedUsers.map((user) => {
              const isSelected = selectedUsers.some((u) => u._id === user._id);
              const isClickDisabled = isMaxLimit
                ? (isClickDisabledFunc?.(user) ?? false) || !isSelected
                : (isClickDisabledFunc?.(user) ?? false) && isSelected;

              return (
                <SearchedUser
                  key={user._id}
                  user={user}
                  isSelected={isSelected}
                  isClickDisabled={isClickDisabled}
                  onClick={() => handleUserClick(user)}
                />
              );
            })}
            {!isSearchOnlyUsers ? (
              <SearchConversationList
                conversations={searchedChats}
                showTitle={true}
                emptyMessage={isChatSearched}
                selectedConversationId={selectedConversationId}
                onConversationClick={(cid) => onConversationClick?.(cid)}
              />
            ) : null}
          </>
        )}
      </CustomVerticalScrollbar>
    </WrapperRoot>
  );
};
