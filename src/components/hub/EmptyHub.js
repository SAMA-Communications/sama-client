import SearchInput from "@components/static/SearchBar";
import SearchBlock from "@components/search/SearchBlock";
import { useState } from "react";

import "@styles/hub/EmptyHub.css";

export default function EmptyHub() {
  const [inputText, setInputText] = useState(null);

  const viewProperty = {
    display: inputText ? "none" : "block",
  };

  const viewHubProperty = {
    padding: "60px 0",
    justifyContent: inputText ? "flex-start" : "center",
  };

  return (
    <section className="hub--empty fcc" style={viewHubProperty}>
      <div className="hub-title__container" style={viewProperty}>
        <p className="hub-title__text">You don't have any chats yet.</p>
      </div>
      <SearchInput
        shadowText={"Search"}
        setState={setInputText}
        isLargeSize={true}
      />
      <SearchBlock searchText={inputText} isPreviewUserProfile={true} />
    </section>
  );
}
