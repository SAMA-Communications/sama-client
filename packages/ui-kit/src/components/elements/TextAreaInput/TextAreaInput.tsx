import { memo } from "react";
import { clsx } from "clsx";

import type { TextAreaInputProps } from "./TextAreaInput.types";

export const TextAreaInput = memo(function TextAreaInput({
  id = "",
  className = "",
  inputRef,
  onInput,
  onKeyDown,
  onBlur,
  placeholder,
  disabled = false,
  autoFocus = true,
  autoComplete = "off",
}: TextAreaInputProps) {
  return (
    <textarea
      id={id}
      className={clsx("ui:font-light ui:focus:outline-none", className)}
      ref={inputRef}
      onInput={onInput}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      disabled={disabled}
      placeholder={placeholder}
    />
  );
});
