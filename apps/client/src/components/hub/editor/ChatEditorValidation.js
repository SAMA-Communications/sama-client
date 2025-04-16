import OvalLoader from "@components/_helpers/OvalLoader.js";
import conversationHandlerService from "@services/conversationHandlerService.js";
import { Tooltip } from "react-tooltip";
import { debounce } from "@hooks/debounce.js";
import { getCurrentUserFromParticipants } from "@store/values/Participants.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateHandler } from "@store/values/Conversations.js";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";

import Debug from "@icons/editor/Debug.svg?react";
import Fail from "@icons/status/Fail.svg?react";
import Save from "@icons/editor/Save.svg?react";
import Success from "@icons/status/Success.svg?react";

export default function ChatEditorValidation({ setLogs }) {
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const testMessage = useRef(null);
  const currentUser = useSelector(getCurrentUserFromParticipants);
  const selectedCid = useSelector(getSelectedConversationId);
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationChecks, setValidationChecks] = useState({});

  const getEditorCode = useCallback(() => {
    const model = conversationHandlerService.getHandlerModelByCid(
      monaco,
      selectedCid
    );
    return model?.getValue();
  }, [monaco, selectedCid]);

  const saveSchemeCode = async () => {
    await conversationHandlerService.saveHandlerByConversation(
      selectedCid,
      getEditorCode()
    );
  };

  const validateCode = useCallback(async () => {
    setValidationStatus("pending");
    const editorCode = getEditorCode();
    const editorCodeSplit = editorCode?.split("\n").slice(0, -3).join("\n");

    try {
      const validationResult = await conversationHandlerService.validateHandler(
        editorCodeSplit
      );
      setValidationChecks(validationResult);

      const compilationResult = await conversationHandlerService.runHandler(
        editorCode,
        { body: testMessage.current.value || "message" },
        currentUser
      );

      setLogs(
        compilationResult.error
          ? JSON.stringify(compilationResult.error, null, 2)
          : compilationResult.data
          ? JSON.stringify(compilationResult.data, null, 2)
          : "//The code is done without any logs"
      );

      setValidationChecks((prevChecks) => ({
        ...prevChecks,
        noSyntaxError: compilationResult.ok,
      }));

      const allChecksPassed = Object.values(validationResult).every(Boolean);
      setValidationStatus(allChecksPassed && compilationResult.ok);
    } catch (error) {
      const isSyntaxError = error.name === "SyntaxError";
      setLogs(
        `${isSyntaxError ? "Syntax" : "Runtime"} Error: ${error.message}`
      );
      setValidationStatus(false);
    }
  }, [getEditorCode, currentUser, testMessage, setLogs]);

  useEffect(() => {
    setTimeout(() => {
      if (!monaco || !selectedCid) return;

      const uri = monaco.Uri.parse(`file://${selectedCid}`);
      const model = monaco.editor.getModel(uri);

      if (model) {
        const timeout = 1000;
        const handleEditorChange = debounce(() => {
          const editorCode = getEditorCode();
          setValidationStatus(null);
          localStorage.setItem(
            `conversation_handler_${selectedCid}`,
            editorCode
          );
          dispatch(updateHandler({ _id: selectedCid, not_saved: true }));
          validateCode();
        }, timeout);

        const disposable = model.onDidChangeContent(handleEditorChange);
        return () => disposable.dispose();
      }
    }, 200);
  }, [monaco, selectedCid, validateCode, getEditorCode]);

  const statusView = useMemo(() => {
    const style = "w-[25px] h-[25px]";
    switch (validationStatus) {
      case "pending":
        return <OvalLoader width={20} height={20} />;
      case true:
        return <Success className={style} />;
      case false:
        return <Fail className={style} />;
      default:
        return <Debug className={style} />;
    }
  }, [validationStatus]);

  const tooltipView = useMemo(() => {
    if (!validationChecks) return null;

    const checks = [
      { key: "noSyntaxError", label: "No syntax errors" },
      { key: "noConsoleLog", label: "No console.log statements" },
      { key: "existResolve", label: "Resolve exists" },
    ];

    return (
      <Tooltip
        id="editor-status-tooltip"
        className="editor-tooltip-style"
        classNameArrow="editor-tooltip-arrow"
      >
        {checks.map(({ key, label }) => (
          <div key={key} className="h-[25px] flex gap-2 items-center">
            {validationChecks[key] ? (
              <Success className="w-[20px] h-[20px]" />
            ) : (
              <Fail className="w-[20px] h-[20px]" />
            )}
            {label}
          </div>
        ))}
      </Tooltip>
    );
  }, [validationChecks]);

  return (
    <div className="h-full flex gap-2.5">
      <div className="edito-validation h-full px-3 py-2 flex items-center gap-2 bg-[#f6f6f6] rounded-lg">
        <div
          data-tooltip-id="editor-status-tooltip"
          data-tooltip-delay-hide={500}
          className="px-1 flex items-center"
        >
          {statusView}
        </div>
        {tooltipView}
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
        Check
      </button>
      <button
        className={`h-full px-5 rounded-lg text-white cursor-pointer ${
          validationStatus ? "bg-[var(--color-accent-dark)]" : "bg-gray-500"
        } flex items-center gap-2`}
        disabled={validationStatus !== true}
        onClick={saveSchemeCode}
      >
        <Save />
        Save
      </button>
    </div>
  );
}
