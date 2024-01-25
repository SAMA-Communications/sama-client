import React, { useEffect, useState, useTransition } from "react";
import api from "@api/api";

import "@newstyles/search/SearchBlock.css";
import SearchedUser from "./elements/SearchedUser";

export default function SearchBlock({ searchText, type }) {
  const viewProperty = (v) => ({ display: v ? "block" : "none" });

  const [isPending, startTransition] = useTransition();
  const [searchedUsers, setSearchedUsers] = useState([]);
  const [isUserSearched, setIsUserSearched] = useState("Search results");

  useEffect(() => {
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
        console.log(users);
        if (isUserSearched === "Search results") {
          setIsUserSearched("We couldn't find the specified user.");
        }
      }
    });
  };

  return (
    <div className="search__container" style={viewProperty(searchText)}>
      {searchedUsers.map((u) => (
        <SearchedUser key={u._id} uObject={u} />
      ))}
    </div>
  );
}
