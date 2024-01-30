import { useRef, useState } from "react";

import "@newstyles/static/SearchBar.css";

import { ReactComponent as Search } from "@newicons/actions/Search.svg";
import { ReactComponent as Close } from "@newicons/options/Close.svg";

export default function SearchInput({ shadowText, setState, isLargeSize }) {
  const inputRef = useRef(null);
  const [isTextInInput, setIsTextInInput] = useState(false);

  const viewProperty = (v) => ({
    width: v ? `${isLargeSize ? 24 : 18}px` : "0",
  });

  const onClear = () => {
    inputRef.current.value = "";
    setIsTextInInput(false);
    setState && setState(null);
  };

  return (
    <div className="search-bar">
      <Search
        className={`search-bar__icon${isLargeSize ? "--large" : ""}`}
        style={viewProperty(!isTextInInput)}
      />
      <input
        ref={inputRef}
        className={`search-bar__input${isLargeSize ? "--large" : ""}`}
        placeholder={shadowText}
        onChange={(e) => {
          setIsTextInInput(!!e.target.value);
          setState && setState(e.target.value);
        }}
        style={{
          [`padding${isTextInInput ? "Right" : "Left"}`]: `${
            isLargeSize ? 60 : 48
          }px`,
        }}
      />
      <Close
        className={`search-bar__close${isLargeSize ? "--large" : ""}`}
        style={viewProperty(isTextInInput)}
        onClick={onClear}
      />
    </div>
  );
}
