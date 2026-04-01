import { TextAreaInput as UITextAreaInput } from "@sama-communications.ui-kit";

export default function TextAreaInput({
  customId = "",
  customClassName = "",
  inputRef,
  handleInput,
  handeOnKeyDown,
  isMobile,
  placeholder,
  isDisabled = false,
}) {
  return (
    <UITextAreaInput
      id={customId}
      className={customClassName}
      inputRef={inputRef}
      onInput={handleInput}
      onKeyDown={handeOnKeyDown}
      onBlur={handleInput}
      placeholder={placeholder}
      disabled={isDisabled}
      autoFocus={!isMobile}
    />
  );
}
