import SearchInput from "@newcomponents/static/SearchBar";
import SearchBlock from "@newcomponents/search/SearchBlock";
import { useMemo, useState } from "react";

import "@newstyles/hub/EmptyHub.css";

export default function EmptyHub() {
  const [inputText, setInputText] = useState(null);

  const viewProperty = useMemo(
    () => ({
      display: inputText ? "none" : "block",
    }),
    [inputText]
  );

  const viewHubProperty = useMemo(
    () => ({
      padding: "60px 0",
      justifyContent: inputText ? "flex-start" : "center",
    }),
    [inputText]
  );

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
      <SearchBlock searchText={inputText} />
    </section>
  );
}
