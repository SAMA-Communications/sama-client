import Editor from "@monaco-editor/react";
import conversationSchemeService from "@services/conversationSchemeService.js";
import globalConstants from "@utils/global/constants.js";
import { constrainedEditor } from "constrained-editor-plugin";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export default function ChatEditorCode() {
  const selectedCid = useSelector(getSelectedConversationId);
  const editorRef = useRef(null);
  let restrictions = [];

  useEffect(() => {
    conversationSchemeService
      .getConversationScheme(selectedCid)
      .then(({ scheme, updated_by }) => {
        //set code from res
      })
      .catch((err) => {
        //set code from default param
      });
  }, []);

  const handleEditorDidMount = (editor, monaco) => {
    monaco.editor.defineTheme("custom", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#f6f6f6" },
    });
    monaco.editor.setTheme("custom");
    editorRef.current = editor;

    const constrainedInstance = constrainedEditor(monaco);
    const model = editor.getModel();
    constrainedInstance.initializeIn(editor);

    restrictions.push({
      range: [5, 1, model.getLineCount() - 3, 1],
      allowMultiline: true,
    });

    constrainedInstance.addRestrictionsTo(model, restrictions);
  };

  return (
    <div className="grow-3 pt-4 pb-4">
      <Editor
        height="100%"
        theme="custom"
        defaultLanguage="javascript"
        value={globalConstants.defaultEditorCode}
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
    </div>
  );
}
