import { useMemo, useCallback } from "react";

import { Modal, ChatNameInput, UserSelectorBlock, useKeyDown, KEY_CODES } from "@sama-communications.ui-kit";

import { SearchBlock, SearchInput } from "@sama-communications.ui-kit";

import { useUsersSelectModal } from "@hooks/components/useUsersSelectModal";

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
          searchInputSlot={
            <SearchInput customClassName="min-h-[48px] w-full" placeholder="Enter a username" setState={setInputText} />
          }
          searchResultsSlot={
            <SearchBlock
              searchText={inputText}
              selectedUsers={selectedUsers}
              addUserToArray={addUser}
              removeUserFromArray={removeUser}
              isClickDisabledFunc={(uObj) => initSelectedUsers?.some((u) => u._id === uObj._id)}
              isMaxLimit={selectedUsers.length >= 50}
              isSelectUserToArray
              isSearchOnlyUsers
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
          searchInputSlot={
            <SearchInput customClassName="min-h-[48px] w-full" placeholder="Enter a username" setState={setInputText} />
          }
          searchResultsSlot={
            <SearchBlock
              searchText={inputText}
              selectedUsers={selectedUsers}
              addUserToArray={addUser}
              removeUserFromArray={removeUser}
              isMaxLimit={selectedUsers.length >= 50}
              isSelectUserToArray
              isSearchOnlyUsers
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

  return (
    <Modal tall={!!chatName || !!isAddParticipants} contentKey={contentKey}>
      {content}
    </Modal>
  );
}
