import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import OvalLoader from "@newcomponents/_helpers/OvalLoader";
import SearchedUser from "./elements/SearchedUser";
import { useEffect, useState, useTransition } from "react";

import "@newstyles/search/SearchBlock.css";
import usersService from "@services/usersService";

export default function SearchBlock({
  searchText,
  selectedUsers,
  clearInputText,
  addUserToArray,
  removeUserFromArray,
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
          limit: 10,
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
        <CustomScrollBar
          customStyle={{ width: "calc(400px * var(--base-scale))" }}
        >
          {searchedUsers.map((u) => (
            <SearchedUser
              key={u._id}
              uObject={u}
              isSelected={selectedUsers?.find((uObj) => uObj._id === u._id)}
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
