import { useRef, useState } from "react";

import Search from "@icons/actions/Search.svg?react";
import Close from "@icons/options/Close.svg?react";

export default function SearchInput({
  shadowText,
  setState,
  isLargeSize,
  customClassName = "",
  customLastClassName = "",
  inputClassName = "",
  closeClassName = "",
}) {
  const inputRef = useRef(null);
  const [isTextInInput, setIsTextInInput] = useState(false);

  const viewProperty = (v) => ({
    width: v ? (isLargeSize ? `24px` : `18px`) : "0px",
  });

  const onClear = () => {
    inputRef.current.value = "";
    setIsTextInInput(false);
    setState && setState(null);
  };

  return (
    <div
      className={`relative ${customClassName} max-md:mt-[5px] max-xl:mt-[20px]`}
    >
      <Search
        className={`absolute top-1/2 left-[17px] transform -translate-y-1/2 z-10 transition-[width] duration-300 l-[15px] ${
          isLargeSize ? "l-[20px]" : ""
        }`}
        style={viewProperty(!isTextInInput)}
      />
      <input
        ref={inputRef}
        className={`w-[360px] py-[11px] px-[15px] text-black text-p !font-light rounded-[12px] bg-(--color-hover-light) ${
          isLargeSize
            ? `w-[500px] py-[14px] px-[20px] text-h6 ${customLastClassName}`
            : ""
        } ${inputClassName} transition-[padding-left,padding-right] duration-300 focus:outline-hidden`}
        style={
          isTextInInput
            ? { paddingRight: isLargeSize ? "60px" : "48px" }
            : { paddingLeft: isLargeSize ? "60px" : "48px" }
        }
        placeholder={shadowText}
        onChange={(e) => {
          setIsTextInInput(!!e.target.value);
          setState && setState(e.target.value);
        }}
      />
      <Close
        className={`absolute top-1/2 right-[15px] transform -translate-y-1/2 z-10 transition-[width] duration-300 r-[15px] cursor-pointer  ${
          isLargeSize ? "!right-[20px]" : ""
        } ${closeClassName}`}
        style={viewProperty(isTextInInput)}
        onClick={onClear}
      />
    </div>
  );
}
