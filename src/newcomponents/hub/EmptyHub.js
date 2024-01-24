import SearchInput from "@newcomponents/static/SearchBar";
import SearchBlock from "@newcomponents/search/SearchBlock";
import { useMemo, useState } from "react";

import "@newstyles/hub/EmptyHub.css";

export default function EmptyHub() {
  const [inputText, setInputText] = useState(null);

  const viewProperty = useMemo(
    () => ({
      width: inputText ? "0px" : "100%",
    }),
    [inputText]
  );

  return (
    <section className="hub--empty fcc">
      <div className="hub-title__container" style={viewProperty}>
        <p className="hub-title__text">You don't have any created chats.</p>
      </div>
      <SearchInput shadowText={"Search"} setState={setInputText} />
      {/* <SearchBlock style={{ display: "none" }} /> */}
    </section>
  );
}
