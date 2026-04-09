import { memo, useRef } from "react";

import { clsx } from "clsx";
import { Search, X } from "lucide-react";

import type { SearchInputProps } from "@elements/SearchInput/SearchInput.types";
import { WrapperRoot } from "@elements/WrapperRoot";

const baseClassName =
  "ui:relative ui:flex ui:h-9 ui:cursor-text ui:flex-row ui:items-center ui:gap-1.5 ui:rounded-xl ui:bg-white ui:px-2.5 ui:shadow-btn";

export const SearchInput = memo(function SearchInput({
  placeholder = "Search",
  value,
  onChange,
  isLargeSize = false,
  customClassName = "",
  className,
  ...rest
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isTextInInput = value.length > 0;

  return (
    <WrapperRoot
      className={clsx(baseClassName, customClassName, className)}
      onClick={() => inputRef.current?.focus()}
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
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
      {isTextInInput ? (
        <button
          type="button"
          className="ui:shrink-0 ui:cursor-pointer ui:rounded ui:p-0.5 ui:text-text-dark ui:duration-150 ui:hover:bg-hover-light"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          aria-label="Clear search"
        >
          <X size={isLargeSize ? 24 : 18} />
        </button>
      ) : null}
    </WrapperRoot>
  );
});
