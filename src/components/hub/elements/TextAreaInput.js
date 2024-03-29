export default function TextAreaInput({
  inputRef,
  handleInput,
  handeOnKeyDown,
  isMobile,
  placeholder,
  isDisabled = false,
}) {
  return (
    <textarea
      id="inputMessage"
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
