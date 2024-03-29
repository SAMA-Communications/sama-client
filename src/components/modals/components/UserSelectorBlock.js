import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";
import UserInfo from "@components/modals/elements/UserInfo";
import { KEY_CODES } from "@helpers/keyCodes";
import { useEffect, useMemo, useState } from "react";

export default function UserSelectorBlock({
  initSelectedUsers,
  closeWindow,
  onClickCreateFunc,
}) {
  const [inputText, setInputText] = useState(null);
  const [counter, setCounter] = useState(initSelectedUsers?.length || 1);
  const [selectedUsers, setSelectedUsers] = useState(initSelectedUsers || []);

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
          <p className="em-selected__text">Select users to add...</p>
        )}
      </div>
    );
  }, [counter, initSelectedUsers, meInArray, selectedUsers]);

  useEffect(() => {
    const handleKeyDown = ({ keyCode }) => {
      if (keyCode === KEY_CODES.ENTER) {
        onClickCreateFunc(
          initSelectedUsers
            ? selectedUsers.filter(
                (u) => !initSelectedUsers.find((uObj) => u._id === uObj._id)
              )
            : selectedUsers
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClickCreateFunc, selectedUsers]);

  return (
    <>
      <div className="em__header">
        <p className="edit-modal__title">Add participants</p>
        <p className="edit-modal__counter">{counter}/50</p>
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
        isMaxLimit={counter >= 50}
        isSelectUserToArray={true}
      />
      <div className="em-navigation__container fcc">
        <p className="em-navigation__link" onClick={closeWindow}>
          Cancel
        </p>
        <p
          className="em-navigation__link"
          onClick={() =>
            onClickCreateFunc(
              initSelectedUsers
                ? selectedUsers.filter(
                    (u) => !initSelectedUsers.find((uObj) => u._id === uObj._id)
                  )
                : selectedUsers
            )
          }
        >
          {initSelectedUsers ? "Add" : "Create"}
        </p>
      </div>
    </>
  );
}
