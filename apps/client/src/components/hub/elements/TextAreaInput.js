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
    <textarea
      id={customId}
      className={`font-light focus:outline-hidden ${customClassName}`}
      ref={inputRef}
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
