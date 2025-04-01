import OvalLoader from "@components/_helpers/OvalLoader.js";
import conversationSchemeService from "@services/conversationSchemeService.js";
import { getCurrentUserFromParticipants } from "@store/values/Participants.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useSelector } from "react-redux";

import Debug from "@icons/editor/Debug.svg?react";
import Fail from "@icons/status/Fail.svg?react";
import Save from "@icons/editor/Save.svg?react";
import Success from "@icons/status/Success.svg?react";

export default function ChatEditorValidation({ setLogs }) {
  const monaco = useMonaco();
  const testMessage = useRef(null);
  const currentUser = useSelector(getCurrentUserFromParticipants);
  const selectedCid = useSelector(getSelectedConversationId);
  const [validationSatus, setValidationStatus] = useState(null);

  const getEditorCode = () => monaco.editor.getModels()[0]?.getValue();

  const validateCode = async () => {
    setValidationStatus("pending");
    const editorCode = getEditorCode();
    const editorCodeSplit = editorCode?.split("\n").slice(0, -3).join("\n");

    try {
      new Function(editorCodeSplit);
    } catch (syntaxError) {
      setLogs(`Syntax Error: ${syntaxError.message}`);
      setValidationStatus(false);
      return;
    }

    try {
      const compilationResult = await conversationSchemeService.runScheme(
        editorCode,
        { body: testMessage.current.value || "message" },
        currentUser
      );
      console.log(compilationResult);

      setLogs(
        compilationResult.error
          ? JSON.stringify(compilationResult.error, null, 2)
          : compilationResult.data
          ? JSON.stringify(compilationResult.data, null, 2)
          : "//The code is done without any logs"
      );
      setValidationStatus(compilationResult.ok);
    } catch (runtimeError) {
      setLogs(`Runtime Error: ${runtimeError.message}`);
      setValidationStatus(false);
    }
  };

  useEffect(() => {
    if (monaco) {
      const editor = monaco.editor.getModels()[0];
      if (editor) {
        const disposable = editor.onDidChangeContent(() =>
          setValidationStatus(null)
        );
        return () => disposable.dispose();
      }
    }
  }, [monaco]);

  const statusView = useMemo(() => {
    const style = "w-[25px] h-[25px]";
    switch (validationSatus) {
      case "pending":
        return <OvalLoader width={20} height={20} />;
      case true:
        return <Success className={style} />;
      case false:
        return <Fail className={style} />;
      default:
        return <Debug className={style} />;
    }
  }, [validationSatus]);

  return (
    <div className="h-full flex gap-2.5">
      <div className="h-full px-3 py-2 flex items-center gap-2 bg-[#f6f6f6] rounded-lg">
        <div className="px-1 flex items-center">{statusView}</div>
        <span className="w-[1px] h-full bg-gray-300"></span>
        <input
          ref={testMessage}
          className="h-full w-[140px] px-1 text-black focus:outline-none"
          placeholder="message"
          defaultValue={"message"}
        />
      </div>
      <button
        className="h-full mr-6.5 px-5 bg-[var(--color-accent-dark)] rounded-lg text-white cursor-pointer"
        onClick={validateCode}
      >
        Debug
      </button>
      <button
        className={`h-full px-5 rounded-lg text-white cursor-pointer ${
          validationSatus ? "bg-[var(--color-accent-dark)]" : "bg-gray-500"
        } flex items-center gap-2`}
        disabled={validationSatus !== true}
        onClick={() =>
          conversationSchemeService.saveSchemeByConversation(
            selectedCid,
            getEditorCode()
          )
        }
      >
        <Save />
        Save
      </button>
    </div>
  );
}
