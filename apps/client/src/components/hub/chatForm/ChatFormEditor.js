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
      <div className="bg-accent-100 flex w-full justify-center rounded-lg py-2">
        <p className="font-light">
          Please read the documentation before you start:{" "}
          <a
            href="https://oleksandr-ch.notion.site/Programmable-Chat-feature-1ffe3b41e4ae804da619f63b706e7263"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-500 cursor-pointer font-normal underline"
          >
            documentation
          </a>
        </p>
      </div>
      <ChatEditorCode />
      <ChatEditorLogs logs={compilerLogs} setLogs={setCompilerLogs} />
      <div className="flex w-full items-end gap-2.5 self-center pb-3.5 lg:max-w-300">
        <ChatEditorHelper />
        <ChatEditorValidation setLogs={setCompilerLogs} />
      </div>
    </>
  );
}
