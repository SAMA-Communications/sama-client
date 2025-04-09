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
      style={{
        flexGrow: 1,
        paddingTop: 18,
        paddingBottom: 18,
        color: "black",
        resize: "none",
      }}
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
