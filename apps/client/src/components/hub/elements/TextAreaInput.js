export default function TextAreaInput({
  customId,
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
      id={customId || "inputMessage"}
      className={`grow py-[18px] text-black resize-none focus:outline-hidden max-xl:disabled:!p-[9px] placeholder:text-(--color-text-dark) placeholder:text-p ${customClassName}`}
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
