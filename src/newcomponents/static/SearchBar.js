import { useRef, useState } from "react";

import "@newstyles/static/SearchBar.css";

import { ReactComponent as Search } from "@newicons/actions/Search.svg";
import { ReactComponent as Close } from "@newicons/options/Close.svg";

export default function SearchInput({ text }) {
  const inputRef = useRef(null);
  const [isTextInInput, setIsTextInInput] = useState(false);

  const showProperty = (v) => ({ width: v ? "24px" : "0" });

  const onClear = () => {
    inputRef.current.value = "";
    setIsTextInInput(false);
  };

  return (
    <div className="searchbar">
      <Search
        className="searchbar__icon"
        style={showProperty(!isTextInInput)}
      />
      <input
        ref={inputRef}
        className="searchbar__input"
        placeholder={text}
        onChange={(e) => setIsTextInInput(!!e.target.value)}
        style={{ [`padding${isTextInInput ? "Right" : "Left"}`]: "60px" }}
      />
      <Close
        className="searchbar__close"
        style={showProperty(isTextInInput)}
        onClick={onClear}
      />
    </div>
  );
}
