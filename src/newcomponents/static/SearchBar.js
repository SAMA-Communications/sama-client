import { useRef, useState } from "react";

import "@newstyles/static/SearchBar.css";

import { ReactComponent as Search } from "@newicons/actions/Search.svg";
import { ReactComponent as Close } from "@newicons/options/Close.svg";

export default function SearchInput({ shadowText, setState }) {
  const inputRef = useRef(null);
  const [isTextInInput, setIsTextInInput] = useState(false);

  const viewroperty = (v) => ({ width: v ? "24px" : "0" });

  const onClear = () => {
    inputRef.current.value = "";
    setIsTextInInput(false);
    setState && setState(null);
  };

  return (
    <div className="search-bar">
      <Search
        className="search-bar__icon"
        style={viewroperty(!isTextInInput)}
      />
      <input
        ref={inputRef}
        className="search-bar__input"
        placeholder={shadowText}
        onChange={(e) => {
          setIsTextInInput(!!e.target.value);
          setState && setState(e.target.value);
        }}
        style={{ [`padding${isTextInInput ? "Right" : "Left"}`]: "60px" }}
      />
      <Close
        className="search-bar__close"
        style={viewroperty(isTextInInput)}
        onClick={onClear}
      />
    </div>
  );
}
