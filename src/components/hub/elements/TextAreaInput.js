export default function TextAreaInput({
  customId,
  inputRef,
  handleInput,
  handeOnKeyDown,
  isMobile,
  placeholder,
  isDisabled = false,
  isEncryptedSessionActive,
}) {
  return (
    <textarea
      id={customId || "inputMessage"}
      style={isEncryptedSessionActive ? { paddingLeft: 15 } : {}}
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
