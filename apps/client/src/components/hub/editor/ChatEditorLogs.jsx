import Editor from "@monaco-editor/react";

import { EditorLogsPanel } from "@sama-communications.ui-kit";

export default function ChatEditorLogs({ logs, setLogs }) {
  const visible = logs != null;

  return (
    <EditorLogsPanel visible={visible} onClose={() => setLogs(null)}>
      <Editor
        height="100%"
        theme="custom"
        defaultLanguage="json"
        value={logs ?? ""}
        path="logs"
        options={{
          fontSize: 16,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          readOnly: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: false,
          wordWrap: "on",
          lineNumbers: "off",
          folding: false,
          occurrencesHighlight: false,
          renderValidationDecorations: "off",
        }}
      />
    </EditorLogsPanel>
  );
}
