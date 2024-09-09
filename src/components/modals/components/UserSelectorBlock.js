import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import OvalLoader from "@components/_helpers/OvalLoader";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";
import UserInfo from "@components/modals/elements/UserInfo";
import { KEY_CODES } from "@helpers/keyCodes";
import { useEffect, useMemo, useState } from "react";
import { useKeyDown } from "@hooks/useKeyDown";

export default function UserSelectorBlock({
  initSelectedUsers,
  closeWindow,
  isEncrypted,
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
      <div className="em-selected__container">
        {filteredUsers.length ? (
          <CustomScrollBar>
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
          <p className="em-selected__text">
            Select user{isEncrypted ? " to create..." : "s to add..."}
          </p>
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
  };

  return (
    <>
      <div className="em__header">
        <p className="edit-modal__title">
          {isEncrypted ? "Create encrypted chat" : "Add participants"}
        </p>
        <p className="edit-modal__counter">
          {counter}/{isEncrypted ? "2" : "50"}
        </p>
      </div>
      <SearchInput shadowText={"Enter a username"} setState={setInputText} />
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
        isMaxLimit={counter >= (isEncrypted ? 2 : 50)}
        isSelectUserToArray={true}
        isSearchOnlyUsers={true}
      />
      <div className="em-navigation__container fcc">
        <p className="em-navigation__link" onClick={closeWindow}>
          Cancel
        </p>
        {isLoading ? (
          <OvalLoader height={60} width={23} />
        ) : (
          <p className="em-navigation__link" onClick={() => validateClick()}>
            {initSelectedUsers ? "Add" : "Create"}
          </p>
        )}
      </div>
    </>
  );
}
