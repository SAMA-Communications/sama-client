import { Tooltip } from "react-tooltip";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMonaco } from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { OvalLoader } from "@sama-communications.ui-kit";

import { getCurrentUserFromParticipants } from "@store/values/Participants.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateHandler } from "@store/values/Conversations.js";

import { debounce } from "@utils/debounce.js";

import { Check, RefreshCw, Save, SearchCode, X } from "lucide-react";

export default function ChatEditorValidation({ setLogs }) {
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const testMessage = useRef(null);
  const currentUser = useSelector(getCurrentUserFromParticipants);
  const selectedCid = useSelector(getSelectedConversationId);
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationChecks, setValidationChecks] = useState({});

  const getEditorCode = useCallback(() => {
    const model = conversationHandlerService.getHandlerModelByCid(monaco, selectedCid);
    return model?.getValue();
  }, [monaco, selectedCid]);

  const saveSchemeCode = async () => {
    await conversationHandlerService.saveHandlerByConversation(selectedCid, getEditorCode());
  };

  const validateCode = useCallback(async () => {
    setValidationStatus("pending");
    const editorCode = getEditorCode();
    const editorCodeSplit = editorCode?.split("\n").slice(0, -3).join("\n");

    try {
      const validationResult = await conversationHandlerService.validateHandler(editorCodeSplit, editorCode);
      setValidationChecks(validationResult);

      const compilationResult = await conversationHandlerService.runHandler(
        editorCode,
        { body: testMessage.current.value || "message" },
        currentUser,
      );

      setLogs(
        compilationResult.error
          ? JSON.stringify(compilationResult.error, null, 2)
          : compilationResult.data
            ? JSON.stringify(compilationResult.data, null, 2)
            : "//The code is done without any logs",
      );

      setValidationChecks((prevChecks) => ({
        ...prevChecks,
        noSyntaxError: compilationResult.ok,
      }));

      const allChecksPassed = Object.values(validationResult).every(Boolean);
      setValidationStatus(allChecksPassed && compilationResult.ok);
    } catch (error) {
      const isSyntaxError = error.name === "SyntaxError";
      setLogs(`${isSyntaxError ? "Syntax" : "Runtime"} Error: ${error.message}`);
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
          setValidationStatus(null);
          const editorCode = getEditorCode();
          if (!editorCode) return;
          localStorage.setItem(`conversation_handler_${selectedCid}`, editorCode);
          dispatch(updateHandler({ _id: selectedCid, not_saved: true }));
          validateCode();
        }, timeout);

        const disposable = model.onDidChangeContent(handleEditorChange);
        return () => disposable.dispose();
      }
    }, 200);
  }, [monaco, selectedCid, validateCode, getEditorCode]);

  const statusView = useMemo(() => {
    switch (validationStatus) {
      case "pending":
        return <OvalLoader width={28} height={28} />;
      case true:
        return <Check size={28} color="green" />;
      case false:
        return <X size={28} color="red" />;
      default:
        return <RefreshCw size={28} color="var(--color-text-dark)" />;
    }
  }, [validationStatus]);

  const tooltipView = useMemo(() => {
    if (!validationChecks) return null;

    const checks = [
      { key: "noSyntaxError", label: "No syntax errors" },
      { key: "isExportHandler", label: "Export handler" },
      { key: "isHandlerHeader", label: "Handler header" },
    ];

    return (
      <Tooltip id="editor-status-tooltip" className="editor-tooltip-style" classNameArrow="editor-tooltip-arrow">
        {checks.map(({ key, label }) => (
          <div key={key} className="flex h-6.25 items-center gap-2">
            {validationChecks[key] ? <Check size={20} color="green" /> : <X size={20} color="red" />}
            {label}
          </div>
        ))}
      </Tooltip>
    );
  }, [validationChecks]);

  return (
    <>
      <div className="editor-validation border-text-dark flex h-full grow items-center justify-end gap-2.75 rounded-xl border p-2">
        <div data-tooltip-id="editor-status-tooltip" data-tooltip-delay-hide={500} className="flex items-center px-1">
          {statusView}
        </div>
        {tooltipView}
        <span className="h-full w-px bg-gray-300"></span>
        <input
          ref={testMessage}
          className="bg-hover-light h-full w-40 rounded-sm px-2 text-black focus:outline-none"
          placeholder="message"
          defaultValue={"message"}
        />
      </div>
      <button
        className="bg-accent-500 flex h-11.5 cursor-pointer items-center gap-1.75 self-end rounded-xl border p-2 text-base text-white"
        onClick={validateCode}
      >
        <SearchCode size={24} color="white" />
        Check
      </button>
      <button
        className={`flex h-11.5 cursor-pointer items-center gap-1.75 self-end rounded-xl border p-2 text-base text-white ${
          validationStatus ? "bg-accent-500" : "bg-gray-500"
        } `}
        disabled={validationStatus !== true}
        onClick={saveSchemeCode}
      >
        <Save size={24} color="white" />
        Save
      </button>
    </>
  );
}
