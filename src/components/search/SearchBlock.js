import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import OvalLoader from "@components/_helpers/OvalLoader";
import SearchedUser from "@components/search/elements/SearchedUser";
import usersService from "@services/usersService";
import { useEffect, useState, useTransition } from "react";

import "@styles/search/SearchBlock.css";

export default function SearchBlock({
  searchText,
  selectedUsers,
  clearInputText,
  addUserToArray,
  removeUserFromArray,
  isMaxLimit,
  isClickDisabledFunc = () => false,
  isSelectUserToArray = false,
  isClearInputText = false,
  isPreviewUserProfile = false,
}) {
  const viewProperty = (v) => ({ display: v ? "block" : "none" });

  const [isPending, startTransition] = useTransition();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isUserSearched, setIsUserSearched] = useState(null);

  useEffect(() => {
    if (!searchText) {
      setSearchedUsers([]);
      setIsUserSearched(null);
    }
    const debounce = setTimeout(() => sendSearchRequest(searchText), 300);
    return () => clearTimeout(debounce);
  }, [searchText]);

  const sendSearchRequest = async (text) => {
    startTransition(async () => {
      if (text?.length > 1) {
        const users = await usersService.search({
          login: text,
          limit: 30,
        });

        setSearchedUsers(users);
        setIsUserSearched(
          users.length ? null : "We couldn't find the specified user."
        );
      }
    });
  };

  return (
    <div className="search__container fcc" style={viewProperty(searchText)}>
      {isPending ? (
        <OvalLoader width={80} height={80} />
      ) : searchedUsers.length ? (
        <CustomScrollBar customStyle={{ width: "400px" }}>
          {searchedUsers.map((u) => (
            <SearchedUser
              key={u.native_id}
              uObject={u}
              isSelected={selectedUsers?.find((uObj) => uObj.native_id === u.native_id)}
              isClickDisabled={
                isMaxLimit
                  ? isClickDisabledFunc(u)
                    ? true
                    : !selectedUsers?.find((uObj) => uObj.native_id === u.native_id)
                  : isClickDisabledFunc(u) &&
                    selectedUsers?.find((uObj) => uObj.native_id === u.native_id)
              }
              clearInputText={clearInputText}
              addUserToArray={addUserToArray}
              removeUserFromArray={removeUserFromArray}
              isClearInputText={isClearInputText}
              isSelectUserToArray={isSelectUserToArray}
              isPreviewUserProfile={isPreviewUserProfile}
            />
          ))}
        </CustomScrollBar>
      ) : (
        <p className="search__text">{isUserSearched}</p>
      )}
    </div>
  );
}
