import { useState } from "react";

import ChatEditorCode from "@components/hub/elements/ChatEditorCode.js";
import ChatEditorHelper from "@components/hub/elements/ChatEditorHelper";
import ChatEditorLogs from "@components/hub/elements/ChatEditorLogs.js";
import ChatEditorValidation from "@components/hub/elements/ChatEditorValidation.js";

export default function ChatFormEditor() {
  const [compilerLogs, setCompilerLogs] = useState(null);

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
