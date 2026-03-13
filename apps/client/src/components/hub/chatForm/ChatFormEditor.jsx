import { useEffect, useState } from "react";
import { useMonaco } from "@monaco-editor/react";

import { ProgrammableEditorDocsBanner } from "@sama-communications.ui-kit";

import ChatEditorCode from "@components/hub/editor/ChatEditorCode";
import ChatEditorHelper from "@components/hub/editor/ChatEditorHelper";
import ChatEditorLogs from "@components/hub/editor/ChatEditorLogs";
import ChatEditorValidation from "@components/hub/editor/ChatEditorValidation";

const DOCS_HREF = "https://oleksandr-ch.notion.site/Programmable-Chat-feature-1ffe3b41e4ae804da619f63b706e7263";

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
      <ProgrammableEditorDocsBanner href={DOCS_HREF} />
      <ChatEditorCode />
      <ChatEditorLogs logs={compilerLogs} setLogs={setCompilerLogs} />
      <div className="ui:flex ui:w-full ui:items-end ui:gap-2.5 ui:self-center ui:pb-3.5 ui:lg:max-w-300">
        <ChatEditorHelper />
        <ChatEditorValidation setLogs={setCompilerLogs} />
      </div>
    </>
  );
}
