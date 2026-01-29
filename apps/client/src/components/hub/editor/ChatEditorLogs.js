import * as m from "motion/react-m";

import Editor from "@monaco-editor/react";

import { Minimize2 } from "lucide-react";

export default function ChatEditorLogs({ logs, setLogs }) {
  if (!logs) return null;

  const closeLogs = () => setLogs(null);

  return (
    <m.div
      className="relative mb-2.5 max-h-[min(400px,25svh)] w-full grow-2 self-center overflow-hidden rounded-xl border border-dashed border-gray-300 lg:max-w-300"
      animate={{ opacity: [0, 1], scale: [0.8, 1.02, 1] }}
      exit={{ scale: [1, 0.8], opacity: [1, 0] }}
      transition={{ duration: 0.3 }}
    >
      <div className="z-10 flex justify-between p-3">
        <p className="h-6.25 text-gray-500">Debugging log:</p>
        <button className="cursor-pointer" onClick={closeLogs}>
          <Minimize2 size={25} color="var(--color-text-dark)" />
        </button>
      </div>
      <div className="absolute top-8.75 left-0 h-[calc(100%)] w-full pt-4 pb-4">
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
            wordWrap: "on",
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
