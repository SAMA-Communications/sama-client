import { useEditorValidation } from "@hooks/components/useEditorValidation";

import { EditorValidationBar } from "@sama-communications.ui-kit";

export default function ChatEditorValidation({ setLogs }) {
  const { statusNode, tooltipContent, onCheck, onSave, saveDisabled, testMessageRef } = useEditorValidation(setLogs);

  return (
    <EditorValidationBar
      statusNode={statusNode}
      tooltipId="editor-status-tooltip"
      tooltipContent={tooltipContent}
      onCheck={onCheck}
      onSave={onSave}
      saveDisabled={saveDisabled}
    >
      <input
        ref={testMessageRef}
        className="bg-hover-light/50 h-full w-40 rounded-sm px-2 py-1.25 font-light text-black focus:outline-none"
        placeholder="message"
        defaultValue="message"
      />
    </EditorValidationBar>
  );
}
