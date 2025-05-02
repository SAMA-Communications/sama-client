import * as m from "motion/react-m";
import { useRef, useState } from "react";
import { AnimatePresence } from "motion/react";

import Search from "@icons/actions/Search.svg?react";
import Close from "@icons/options/Close.svg?react";

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

  const hideIcon = (reverseDirection = false) => {
    const marginKey = reverseDirection ? "marginRight" : "marginLeft";
    const size = isLargeSize ? 24 : 18;

    return {
      hidden: { width: 0, [marginKey]: -10 },
      visible: { width: size, [marginKey]: 0 },
      exit: { width: 0, [marginKey]: -10 },
      transition: { duration: 0.3 },
    };
  };

  return (
    <m.div
      className={`relative flex flex-row gap-[10px] items-center bg-(--color-hover-light) rounded-[12px] ${
        isLargeSize
          ? "w-[500px] h-[60px] px-[20px]"
          : "w-[360px] h-[46px] px-[15px]"
      } ${customClassName}`}
      initial={
        disableAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
      }
      animate={{ opacity: 1, scale: 1 }}
      exit={
        disableAnimation ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
      }
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <AnimatePresence>
        {isTextInInput ? null : (
          <m.div
            key="searchInputSearchIcon"
            className="overflow-hidden"
            variants={hideIcon(false)}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition="transition"
          >
            <Search className={isLargeSize ? "w-[24px]" : "w-[18px]"} />
          </m.div>
        )}
      </AnimatePresence>
      <input
        ref={inputRef}
        className={`flex-1 text-black !font-light focus:outline-hidden ${
          isLargeSize ? `text-h6` : "text-p"
        }`}
        placeholder={shadowText}
        onChange={(e) => {
          setIsTextInInput(!!e.target.value);
          setState && setState(e.target.value);
        }}
      />
      <AnimatePresence>
        {isTextInInput ? (
          <m.div
            key="searchInputClosehIcon"
            className="overflow-hidden cursor-pointer"
            variants={hideIcon(true)}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition="transition"
          >
            <Close
              className={isLargeSize ? "w-[24px]" : "w-[18px]"}
              onClick={onClear}
            />
          </m.div>
        ) : null}
      </AnimatePresence>
    </m.div>
  );
}
