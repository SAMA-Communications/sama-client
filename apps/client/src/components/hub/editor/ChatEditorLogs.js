import { motion as m } from "framer-motion";

import Editor from "@monaco-editor/react";

import Hide from "@icons/editor/Hide.svg?react";

export default function ChatEditorLogs({ logs, setLogs }) {
  if (!logs) return null;

  const closeLogs = () => setLogs(null);

  return (
    <m.div
      className="relative max-h-[min(400px,25svh)] grow-2 mb-[10px] border-1 border-gray-300 border-dashed rounded-xl overflow-hidden"
      animate={{ opacity: [0, 1], scale: [0.8, 1.02, 1] }}
      exit={{ scale: [1, 0.8], opacity: [1, 0] }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-3 flex justify-between z-10">
        <p className="h-[25px] text-gray-500">Debugging log:</p>
        <button className="cursor-pointer" onClick={closeLogs}>
          <Hide className="w-[25px] h-[25px]" />
        </button>
      </div>
      <div className="absolute top-[35px] left-0 h-[calc(100%)] w-full pt-4 pb-4">
        <Editor
          height="100%"
          theme="custom"
          defaultLanguage="json"
          value={logs}
          path={"logs"}
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
    </m.div>
  );
}
