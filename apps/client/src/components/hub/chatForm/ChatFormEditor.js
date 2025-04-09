import { useEffect, useState } from "react";
import { useMonaco } from "@monaco-editor/react";

import ChatEditorCode from "@components/hub/editor/ChatEditorCode.js";
import ChatEditorHelper from "@components/hub/editor/ChatEditorHelper";
import ChatEditorLogs from "@components/hub/editor/ChatEditorLogs.js";
import ChatEditorValidation from "@components/hub/editor/ChatEditorValidation.js";

export default function ChatFormEditor() {
  const monaco = useMonaco();
  const [compilerLogs, setCompilerLogs] = useState(null);

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.defineTheme("custom", {
      base: "vs",
      inherit: true,
      rules: [],
      colors: { "editor.background": "#f6f6f6" },
    });
    monaco.editor.setTheme("custom");
  }, [monaco]);

  return (
    <>
      <ChatEditorCode />
      <ChatEditorLogs logs={compilerLogs} setLogs={setCompilerLogs} />
      <div className="h-[61px] px-5 py-2 flex-shrink-0 flex justify-between items-center rounded-2xl bg-[var(--color-hover-light)]">
        <ChatEditorHelper />
        <ChatEditorValidation setLogs={setCompilerLogs} />
      </div>
    </>
  );
}
