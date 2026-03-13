import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useMonaco } from "@monaco-editor/react";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { OvalLoader } from "@sama-communications.ui-kit";

import { getCurrentUserFromParticipants } from "@store/values/Participants.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateHandler } from "@store/values/Conversations.js";

import { debounce } from "@utils/debounce.js";

import { Check, RefreshCw, X } from "lucide-react";

const VALIDATION_CHECKS = [
  { key: "noSyntaxError", label: "No syntax errors" },
  { key: "isExportHandler", label: "Export handler" },
  { key: "isHandlerHeader", label: "Handler header" },
];

export function useEditorValidation(setLogs) {
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const testMessageRef = useRef(null);
  const currentUser = useSelector(getCurrentUserFromParticipants);
  const selectedCid = useSelector(getSelectedConversationId);
  const [validationStatus, setValidationStatus] = useState(null);
  const [validationChecks, setValidationChecks] = useState({});

  const getEditorCode = useCallback(() => {
    const model = conversationHandlerService.getHandlerModelByCid(monaco, selectedCid);
    return model?.getValue();
  }, [monaco, selectedCid]);

  const saveSchemeCode = useCallback(async () => {
    await conversationHandlerService.saveHandlerByConversation(selectedCid, getEditorCode());
  }, [selectedCid, getEditorCode]);

  const validateCode = useCallback(async () => {
    setValidationStatus("pending");
    const editorCode = getEditorCode();
    const editorCodeSplit = editorCode?.split("\n").slice(0, -3).join("\n");

    try {
      const validationResult = await conversationHandlerService.validateHandler(editorCodeSplit, editorCode);
      setValidationChecks(validationResult);

      const compilationResult = await conversationHandlerService.runHandler(
        editorCode,
        { body: testMessageRef.current?.value || "message" },
        currentUser,
      );

      setLogs(
        compilationResult.error
          ? JSON.stringify(compilationResult.error, null, 2)
          : compilationResult.data
            ? JSON.stringify(compilationResult.data, null, 2)
            : "//The code is done without any logs",
      );

      setValidationChecks((prev) => ({ ...prev, noSyntaxError: compilationResult.ok }));
      const allChecksPassed = Object.values(validationResult).every(Boolean);
      setValidationStatus(allChecksPassed && compilationResult.ok);
    } catch (error) {
      const isSyntaxError = error.name === "SyntaxError";
      setLogs(`${isSyntaxError ? "Syntax" : "Runtime"} Error: ${error.message}`);
      setValidationStatus(false);
    }
  }, [getEditorCode, currentUser, setLogs]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!monaco || !selectedCid) return;
      const uri = monaco.Uri.parse(`file://${selectedCid}`);
      const model = monaco.editor.getModel(uri);
      if (model) {
        const handleEditorChange = debounce(() => {
          setValidationStatus(null);
          const editorCode = getEditorCode();
          if (!editorCode) return;
          localStorage.setItem(`conversation_handler_${selectedCid}`, editorCode);
          dispatch(updateHandler({ _id: selectedCid, not_saved: true }));
          validateCode();
        }, 1000);
        const disposable = model.onDidChangeContent(handleEditorChange);
        return () => disposable.dispose();
      }
    }, 200);
  }, [monaco, selectedCid, validateCode, getEditorCode, dispatch]);

  const statusNode = useMemo(() => {
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

  const tooltipContent = useMemo(() => {
    if (!validationChecks || Object.keys(validationChecks).length === 0) return null;
    return (
      <>
        {VALIDATION_CHECKS.map(({ key, label }) => (
          <div key={key} className="flex h-6.25 items-center gap-2">
            {validationChecks[key] ? <Check size={20} color="green" /> : <X size={20} color="red" />}
            {label}
          </div>
        ))}
      </>
    );
  }, [validationChecks]);

  return {
    statusNode,
    tooltipContent,
    onCheck: validateCode,
    onSave: saveSchemeCode,
    saveDisabled: validationStatus !== true,
    testMessageRef,
  };
}
