import Editor, { useMonaco } from "@monaco-editor/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { EditorCodePanel } from "@sama-communications.ui-kit";

import { getConverastionById } from "@store/values/Conversations.js";

import { useProgrammableEditorCode } from "@hooks/components/useProgrammableEditorCode";

export default function ChatEditorCode() {
  const monaco = useMonaco();
  const selectedConversation = useSelector(getConverastionById);
  const selectedCid = selectedConversation?._id;
  const { editorCode, codeStatusText, handleEditorDidMount } =
    useProgrammableEditorCode(selectedCid);

  useEffect(() => {
    if (!selectedCid || !monaco) return;
    const updateModelValue = async () => {
      const localStorageCode = await conversationHandlerService.getHandlerFromLocalStorage(selectedCid);
      const uri = monaco.Uri.parse(`file://${selectedCid}`);
      const model = monaco.editor.getModel(uri);
      if (model) model.setValue(localStorageCode || editorCode || "");
    };
    const t = setTimeout(updateModelValue, 100);
    return () => clearTimeout(t);
  }, [monaco, selectedCid, editorCode]);

  if (!selectedCid) return null;

  return (
    <EditorCodePanel statusText={codeStatusText}>
      <Editor
        height="100%"
        theme="custom"
        wrapperProps={{ className: "pb-[35px]" }}
        defaultLanguage="javascript"
        value={editorCode}
        path={selectedCid}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 16,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          automaticLayout: true,
          suggestOnTriggerCharacters: true,
          quickSuggestions: true,
        }}
      />
    </EditorCodePanel>
  );
}
