import React, { useEffect, useState, useTransition } from "react";
import SearchedUser from "./elements/SearchedUser";
import api from "@api/api";

import "@newstyles/search/SearchBlock.css";
import Scrollbars from "react-custom-scrollbars-2";

export default function SearchBlock({ searchText, type }) {
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
        const requestData = {
          login: text,
          limit: 10,
        };

        const users = await api.userSearch(requestData);
        setSearchedUsers(users);

        setIsUserSearched(
          users.length ? null : "We couldn't find the specified user."
        );
      }
    });
  };

  return (
    <div className="search__container fcc" style={viewProperty(searchText)}>
      {searchedUsers.length ? (
        <Scrollbars
          autoHide
          autoHideTimeout={400}
          autoHideDuration={400}
          style={{ width: "400px" }}
        >
          {searchedUsers.map((u) => (
            <SearchedUser key={u._id} uObject={u} />
          ))}
        </Scrollbars>
      ) : (
        <p className="search__text">{isUserSearched}</p>
      )}
    </div>
  );
}
