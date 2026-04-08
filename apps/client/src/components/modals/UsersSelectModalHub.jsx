import { useMemo, useCallback } from "react";

import { useSearchBlock } from "@hooks/components/useSearchBlock";
import { useUsersSelectModal } from "@hooks/components/useUsersSelectModal";

import { Modal, ChatNameInput, UserSelectorBlock, useKeyDown, KEY_CODES } from "@sama-communications.ui-kit";
import { SearchBlock, SearchInput } from "@sama-communications.ui-kit";

import { showCustomAlert } from "@utils/GeneralUtils.js";

export default function UsersSelectModalHub({ type }) {
  const {
    chatName,
    setChatName,
    setChatImage,
    selectedUsers,
    inputText,
    setInputText,
    closeModal,
    closeAddParticipants,
    sendCreateRequest,
    sendEditRequest,
    initSelectedUsers,
    addUser,
    removeUser,
  } = useUsersSelectModal({ type });

  const isAddParticipants = type === "add_participants";

  const searchBlockData = useSearchBlock(inputText ?? "", {
    isSearchOnlyUsers: true,
    isShowDefaultConvs: false,
  });

  const handleConfirmName = useCallback(
    (name, image) => {
      setChatName(name);
      setChatImage(image);
    },
    [setChatName, setChatImage],
  );

  const content = useMemo(() => {
    if (isAddParticipants) {
      return (
        <UserSelectorBlock
          selectedUsers={selectedUsers}
          onAddUser={addUser}
          onRemoveUser={removeUser}
          initSelectedUsers={initSelectedUsers}
          onClose={closeAddParticipants}
          onCreate={sendEditRequest}
          isSearchExpanded={inputText?.length > 0}
          searchInputSlot={
            <SearchInput
              customClassName="h-9 w-full"
              placeholder="Enter a username"
              value={inputText ?? ""}
              onChange={(v) => setInputText(v || null)}
            />
          }
          searchResultsSlot={
            <SearchBlock
              searchText={inputText}
              searchOptions={{ isSearchOnlyUsers: true, isShowDefaultConvs: false }}
              searchedUsers={searchBlockData.searchedUsers}
              isUserSearched={searchBlockData.isUserSearched}
              isPending={searchBlockData.isPending}
              selectedUsers={selectedUsers}
              onAddUser={addUser}
              onRemoveUser={removeUser}
              isClickDisabledFunc={(uObj) => initSelectedUsers?.some((u) => u._id === uObj._id)}
              isMaxLimit={selectedUsers.length >= 50}
              isSelectUserToArray
              isSearchOnlyUsers
              isShowDefaultConvs={false}
              customClassName="ui:!h-auto ui:min-h-0 ui:mt-[5px] ui:flex ui:items-start ui:justify-center ui:max-xl:w-full ui:max-xl:rounded-[16px] ui:max-xl:bg-bg-light"
            />
          }
          submitLabel="Add"
        />
      );
    }

    if (chatName) {
      return (
        <UserSelectorBlock
          selectedUsers={selectedUsers}
          onAddUser={addUser}
          onRemoveUser={removeUser}
          onClose={closeModal}
          onCreate={sendCreateRequest}
          isSearchExpanded={inputText?.length > 0}
          searchInputSlot={
            <SearchInput
              customClassName="h-9 w-full"
              placeholder="Enter a username"
              value={inputText ?? ""}
              onChange={(v) => setInputText(v || null)}
            />
          }
          searchResultsSlot={
            <SearchBlock
              searchText={inputText}
              searchOptions={{ isSearchOnlyUsers: true, isShowDefaultConvs: false }}
              searchedUsers={searchBlockData.searchedUsers}
              isUserSearched={searchBlockData.isUserSearched}
              isPending={searchBlockData.isPending}
              selectedUsers={selectedUsers}
              onAddUser={addUser}
              onRemoveUser={removeUser}
              isMaxLimit={selectedUsers.length >= 50}
              isSelectUserToArray
              isSearchOnlyUsers
              isShowDefaultConvs={false}
              customClassName="ui:!h-auto ui:min-h-0 ui:mt-[5px] ui:flex ui:items-start ui:justify-center ui:max-xl:w-full ui:max-xl:rounded-[16px] ui:max-xl:bg-bg-light"
            />
          }
          submitLabel="Create"
        />
      );
    }

    return (
      <ChatNameInput
        onConfirm={handleConfirmName}
        onCancel={closeModal}
        onValidationError={(msg) => showCustomAlert(msg, "warning")}
      />
    );
  }, [
    isAddParticipants,
    chatName,
    selectedUsers,
    inputText,
    initSelectedUsers,
    searchBlockData,
    addUser,
    removeUser,
    closeModal,
    closeAddParticipants,
    sendCreateRequest,
    sendEditRequest,
    setInputText,
    handleConfirmName,
  ]);

  const handleEscape = isAddParticipants ? closeAddParticipants : closeModal;
  useKeyDown(KEY_CODES.ESCAPE, handleEscape);

  const contentKey = isAddParticipants ? "addParticipants" : chatName ? "userSelectorBlock" : "chatNameInput";

  return <Modal contentKey={contentKey}>{content}</Modal>;
}
