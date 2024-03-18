import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import SearchBlock from "@newcomponents/search/SearchBlock";
import SearchInput from "@newcomponents/static/SearchBar";
import SelectedUser from "@newcomponents/modals/elements/SelectedUser";
import { useMemo, useState } from "react";

export default function UserSelectorBlock({
  initSelectedUsers,
  closeWindow,
  onClickCreateFunc,
}) {
  const [inputText, setInputText] = useState(null);
  const [counter, setCounter] = useState(initSelectedUsers.length || 1);
  const [selectedUsers, setSelectedUsers] = useState(initSelectedUsers || []);

  const meInArray = initSelectedUsers ? 0 : 1;

  const selectedUsersBlock = useMemo(() => {
    selectedUsers.length + meInArray !== counter &&
      setCounter(meInArray + selectedUsers.length);

    const filteredUsers = initSelectedUsers
      ? selectedUsers.filter(
          (u) => !initSelectedUsers.find((uObj) => uObj._id === u._id)
        )
      : selectedUsers;

    return (
      <div className="em-selected__container">
        {filteredUsers.length ? (
          <CustomScrollBar>
            {filteredUsers.map((u) => (
              <SelectedUser
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
          <p className="em-selected__text">Who do you want to add?</p>
        )}
      </div>
    );
  }, [selectedUsers]);

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
        isSelectUserToArray={true}
      />
      <div className="em-navigation__container fcc">
        <p className="em-navigation__link" onClick={closeWindow}>
          Cancel
        </p>
        <p
          className="em-navigation__link"
          onClick={() => onClickCreateFunc(selectedUsers)}
        >
          Create
        </p>
      </div>
    </>
  );
}
