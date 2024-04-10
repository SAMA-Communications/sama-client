export default function TextAreaInput({
  customId,
  inputRef,
  handleInput,
  handeOnKeyDown,
  isMobile,
  placeholder,
  isDisabled = false,
}) {
  return (
    <textarea
      id={customId || "inputMessage"}
      ref={inputRef}
      onTouchStart={(e) => !e.target.value.length && e.target.blur()}
      onInput={handleInput}
      onKeyDown={handeOnKeyDown}
      onBlur={handleInput}
      autoComplete="off"
      autoFocus={!isMobile}
      disabled={isDisabled}
      placeholder={placeholder}
    />
  );
}
