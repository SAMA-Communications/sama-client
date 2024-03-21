import globalConstants from "@helpers/constants";
import isMobile from "@utils/get_device_type";
import { KEY_CODES } from "@helpers/keyCodes";

import { ReactComponent as Attach } from "@icons/options/Attach.svg";
import { ReactComponent as Send } from "@icons/options/Send.svg";

export default function MessageInput({
  inputTextRef,
  inputFilesRef,
  onSubmitFunc,
}) {
  const pickUserFiles = () => inputFilesRef.current.click();

  const handleInput = (e) => {
    if (inputTextRef.current) {
      const countOfLines = e.target.value.split("\n").length - 1;
      inputTextRef.current.style.height = `calc(${
        55 + countOfLines * 20 < 230 ? 55 + countOfLines * 20 : 215
      }px * var(--base-scale)) `;
      inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
    }
  };

  const handeOnKeyDown = (e) => {
    if (
      e.keyCode === KEY_CODES.ENTER &&
      ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
    ) {
      e.preventDefault();
      onSubmitFunc();
    }
  };

  return (
    <div className="inputs__container">
      <Attach className="input-file__button" onClick={pickUserFiles} />
      <input
        id="inputFile"
        ref={inputFilesRef}
        //onChange open pop-up window for attach files
        type="file"
        accept={globalConstants.allowedFileFormats}
        multiple
      />
      <textarea
        id="inputMessage"
        ref={inputTextRef}
        onTouchStart={(e) => !e.target.value.length && e.target.blur()}
        onInput={handleInput}
        onKeyDown={handeOnKeyDown}
        onBlur={handleInput}
        autoComplete="off"
        autoFocus={!isMobile}
        placeholder="Type your message..."
      />
      <Send className="input-text__button" onClick={onSubmitFunc} />
    </div>
  );
}
