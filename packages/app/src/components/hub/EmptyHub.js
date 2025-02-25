import MenuButtons from "../info/elements/MenuButtons";
import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";
import { getIsMobileView } from "@store/values/IsMobileView";
import { useSelector } from "react-redux";
import { useState } from "react";

import "@styles/hub/EmptyHub.css";

export default function EmptyHub() {
  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);

  const viewProperty = {
    display: inputText ? "none" : "block",
  };

  const viewHubProperty = {
    padding: "60px 0",
    justifyContent: inputText ? "flex-start" : "center",
  };

  return (
    <>
      {isMobileView ? <MenuButtons /> : null}
      <section className="hub--empty fcc" style={viewHubProperty}>
        <div className="hub-title__container" style={viewProperty}>
          <p className="hub-title__text">You don't have any chats yet.</p>
        </div>
        <SearchInput
          shadowText={"Search"}
          setState={setInputText}
          isLargeSize={true}
        />
        <SearchBlock
          searchText={inputText}
          isPreviewUserProfile={true}
          isSearchOnlyUsers={true}
        />
      </section>
    </>
  );
}
