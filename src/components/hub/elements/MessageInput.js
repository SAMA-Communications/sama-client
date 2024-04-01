import TextAreaInput from "@components/hub/elements/TextAreaInput";
import addSuffix from "@src/utils/navigation/add_suffix";
import isMobile from "@utils/get_device_type";
import { KEY_CODES } from "@helpers/keyCodes";
import { useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";

import { ReactComponent as Attach } from "@icons/options/Attach.svg";
import { ReactComponent as Send } from "@icons/options/Send.svg";

export default function MessageInput({
  inputTextRef,
  onSubmitFunc,
  isBlockedConv,
}) {
  const location = useLocation();

  const handleInput = useCallback(
    (e) => {
      if (inputTextRef.current) {
        const countOfLines = e.target.value.split("\n").length - 1;
        inputTextRef.current.style.height = `calc(${
          55 + countOfLines * 20 < 230 ? 55 + countOfLines * 20 : 215
        }px * var(--base-scale)) `;
        inputTextRef.current.scrollTop = inputTextRef.current.scrollHeight;
      }
    },
    [inputTextRef]
  );
  const handeOnKeyDown = useCallback(
    (e) => {
      if (
        e.keyCode === KEY_CODES.ENTER &&
        ((!isMobile && !e.shiftKey) || (isMobile && e.shiftKey))
      ) {
        e.preventDefault();
        onSubmitFunc();
      }
    },
    [onSubmitFunc]
  );

  const inputsView = useMemo(() => {
    if (isBlockedConv) {
      return (
        <TextAreaInput
          inputRef={inputTextRef}
          handleInput={handleInput}
          handeOnKeyDown={handeOnKeyDown}
          isDisabled={true}
          isMobile={isMobile}
          placeholder={
            "The user you are currently chatting with has deleted their account. You can no longer continue the chat."
          }
        />
      );
    }

    return (
      <>
        <Attach
          className="input-file__button"
          onClick={() =>
            addSuffix(location.pathname + location.hash, "/attach")
          }
        />
        <TextAreaInput
          inputRef={inputTextRef}
          handleInput={handleInput}
          handeOnKeyDown={handeOnKeyDown}
          isDisabled={false}
          isMobile={isMobile}
          placeholder={"Type your message..."}
        />
        <Send className="input-text__button" onClick={onSubmitFunc} />
      </>
    );
  }, [
    handeOnKeyDown,
    handleInput,
    location,
    inputTextRef,
    isBlockedConv,
    onSubmitFunc,
  ]);

  return <div className="inputs__container">{inputsView}</div>;
}
