import * as m from "motion/react-m";
import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import { Search, X } from "lucide-react";

export default function SearchInput({
  shadowText,
  setState,
  isLargeSize,
  disableAnimation = true,
  customClassName = "",
}) {
  const inputRef = useRef(null);
  const [isTextInInput, setIsTextInInput] = useState(false);

  const onClear = () => {
    inputRef.current.value = "";
    setIsTextInInput(false);
    setState && setState(null);
  };

  return (
    <div
      className={`border-text-dark relative flex h-9 flex-row items-center gap-1.5 rounded-xl border px-2.5 ${customClassName}`}
    >
      <Search size={isLargeSize ? 24 : 18} />
      <input
        ref={inputRef}
        className={`flex-1 font-light text-black focus:outline-hidden ${isLargeSize ? `text-h6` : "text-base"}`}
        placeholder={shadowText}
        onChange={(e) => {
          setIsTextInInput(!!e.target.value);
          setState && setState(e.target.value);
        }}
      />
      {isTextInInput ? <X className="cursor-pointer" size={isLargeSize ? 24 : 18} onClick={onClear} /> : null}
    </div>
  );
}
