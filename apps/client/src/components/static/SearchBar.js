import { useRef, useState } from "react";

import "@styles/static/SearchBar.css";

import Search from "@icons/actions/Search.svg?react";
import Close from "@icons/options/Close.svg?react";

export default function SearchInput({ shadowText, setState, isLargeSize }) {
  const inputRef = useRef(null);
  const [isTextInInput, setIsTextInInput] = useState(false);

  const viewProperty = (v) => ({
    width: v ? `${isLargeSize ? `24px` : `18px`}` : "0",
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
            isLargeSize ? `60px` : `48px`
          }`,
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
