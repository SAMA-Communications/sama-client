import { useEffect, useMemo, useState } from "react";

import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchInput";
import UserInfo from "@components/modals/elements/UserInfo";

import { OvalLoader, CustomScrollBar } from "@sama-communications.ui-kit";

import { useKeyDown } from "@hooks/useKeyDown";

import { KEY_CODES } from "@utils/constants.js";

export default function UserSelectorBlock({
  initSelectedUsers,
  closeWindow,
  onClickCreateFunc,
}) {
  const [inputText, setInputText] = useState(null);
  const [counter, setCounter] = useState(initSelectedUsers?.length || 1);
  const [selectedUsers, setSelectedUsers] = useState(initSelectedUsers || []);

  const [isLoading, setIsLoading] = useState(false);

  const meInArray = initSelectedUsers ? 0 : 1;

  useEffect(() => {
    if (!initSelectedUsers) {
      return;
    }

    setCounter(initSelectedUsers?.length);
    setSelectedUsers(initSelectedUsers);
  }, [initSelectedUsers]);

  const selectedUsersBlock = useMemo(() => {
    selectedUsers.length + meInArray !== counter &&
      setCounter(meInArray + selectedUsers.length);

    const filteredUsers = initSelectedUsers?.length
      ? selectedUsers.filter(
          (u) => !initSelectedUsers.find((uObj) => uObj._id === u._id)
        )
      : selectedUsers;

    return (
      <div className="-mt-[5px] -mb-[5px] flex items-center min-h-[32px] max-h-[64px]">
        {filteredUsers.length ? (
          <CustomScrollBar childrenClassName="flex flex-row gap-[7px] rounded-[8px]">
            {filteredUsers.map((u) => (
              <UserInfo
                key={u._id}
                uObject={u}
                onClickFunc={() =>
                  setSelectedUsers((prev) =>
                    prev.filter((uObj) => uObj._id !== u._id)
                  )
                }
              />
            ))}
          </CustomScrollBar>
        ) : (
          <p className="text-h6">Select users to add...</p>
        )}
      </div>
    );
  }, [counter, initSelectedUsers, meInArray, selectedUsers]);

  useKeyDown(KEY_CODES.ENTER, () => validateClick());

  const validateClick = () => {
    setIsLoading(true);
    onClickCreateFunc(
      initSelectedUsers
        ? selectedUsers.filter(
            (u) => !initSelectedUsers.find((uObj) => u._id === uObj._id)
          )
        : selectedUsers
    );
    setIsLoading(false);
  };

  return (
    <>
      <div className="flex justify-between">
        <p className="text-h5 !font-normal text-black">Add participants</p>
        <p className="text-h5 !font-normal text-(--colot-text-dark)">
          {counter}/50
        </p>
      </div>
      <SearchInput
        customClassName="min-h-[48px] w-full"
        shadowText={"Enter a username"}
        setState={setInputText}
      />
      {selectedUsersBlock}
      <SearchBlock
        searchText={inputText}
        selectedUsers={selectedUsers}
        addUserToArray={(uObj) =>
          setSelectedUsers((prev) => {
            const isInclude = prev.find((u) => u._id === uObj._id);
            return isInclude ? prev : [...prev, uObj];
          })
        }
        removeUserFromArray={(uObj) =>
          setSelectedUsers((prev) => prev.filter((u) => u._id !== uObj._id))
        }
        isClickDisabledFunc={(uObj) =>
          initSelectedUsers?.find((u) => u._id === uObj._id)
        }
        isMaxLimit={counter >= 50}
        isSelectUserToArray={true}
        isSearchOnlyUsers={true}
      />
      <div className="mt-auto justify-end gap-[30px] flex items-center">
        <p
          className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
          onClick={closeWindow}
        >
          Cancel
        </p>
        {isLoading ? (
          <OvalLoader wrapperClassName="!p-[0px]" height={60} width={23} />
        ) : (
          <p
            className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
            onClick={() => validateClick()}
          >
            {initSelectedUsers ? "Add" : "Create"}
          </p>
        )}
      </div>
    </>
  );
}
