import Editor from "@monaco-editor/react";

import Hide from "@icons/editor/Hide.svg?react";

export default function ChatEditorLogs({ logs, setLogs }) {
  if (!logs) return null;

  const closeLogs = () => setLogs(null);

  return (
    <div className="grow-2 mb-[10px] border-1 border-gray-400 border-solid rounded-xl overflow-hidden">
      <div className="p-3 flex justify-between">
        <p className="text-gray-500">Debugging log:</p>
        <button className="cursor-pointer" onClick={closeLogs}>
          <Hide className="w-[25px] h-[25px]" />
        </button>
      </div>
      <Editor
        height="80%"
        theme="custom"
        defaultLanguage="json"
        value={logs}
        options={{
          fontSize: 16,
          scrollBeyondLastLine: false,
          minimap: { enabled: false },
          readOnly: true,
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          wordBasedSuggestions: false,
          lineNumbers: "off",
          folding: false,
          occurrencesHighlight: false,
          renderValidationDecorations: "off",
        }}
      />
    </div>
  );
}
