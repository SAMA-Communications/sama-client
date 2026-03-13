import { memo, useCallback, useRef, useState } from "react";
import { clsx } from "clsx";
import { Search, X } from "lucide-react";

import { WrapperRoot } from "../WrapperRoot";
import type { SearchInputProps } from "./SearchInput.types";

const baseClassName =
  "ui:relative ui:flex ui:h-9 ui:cursor-text ui:flex-row ui:items-center ui:gap-1.5 ui:rounded-xl ui:bg-white ui:px-2.5 ui:shadow-btn";

export const SearchInput = memo(function SearchInput({
  placeholder = "Search",
  value: controlledValue,
  onChange,
  setState,
  isLargeSize = false,
  disableAnimation = true,
  customClassName = "",
  inputRef: inputRefProp,
  className,
  ...rest
}: SearchInputProps) {
  const internalRef = useRef<HTMLInputElement | null>(null);
  const inputRef = inputRefProp ?? internalRef;

  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;
  const isTextInInput = value.length > 0;

  const onClear = useCallback(() => {
    if (inputRef?.current) inputRef.current.value = "";
    if (isControlled && onChange) onChange("");
    else setInternalValue("");
    setState?.(null);
  }, [inputRef, isControlled, onChange, setState]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = e.target.value;
      if (isControlled && onChange) onChange(v);
      else setInternalValue(v);
      setState?.(v || null);
    },
    [isControlled, onChange, setState],
  );

  const focusInput = useCallback(() => inputRef?.current?.focus(), [inputRef]);

  const handleClearClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onClear();
    },
    [onClear],
  );

  return (
    <WrapperRoot
      className={clsx(baseClassName, customClassName, className)}
      onClick={focusInput}
      role="search"
      {...rest}
    >
      <Search size={isLargeSize ? 24 : 18} className="ui:shrink-0 ui:text-text-dark" />
      <input
        ref={inputRef}
        type="search"
        className="ui:min-w-0 ui:flex-1 ui:border-0 ui:bg-transparent ui:font-light ui:text-black ui:placeholder:text-text-dark ui:focus:outline-none"
        style={{ fontSize: isLargeSize ? "var(--text-h6, 1rem)" : "1rem" }}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        aria-label={placeholder}
      />
      {isTextInInput ? (
        <button
          type="button"
          className="ui:shrink-0 ui:cursor-pointer ui:rounded ui:p-0.5 ui:text-text-dark ui:hover:bg-hover-light"
          onClick={handleClearClick}
          aria-label="Clear search"
        >
          <X size={isLargeSize ? 24 : 18} />
        </button>
      ) : null}
    </WrapperRoot>
  );
});
