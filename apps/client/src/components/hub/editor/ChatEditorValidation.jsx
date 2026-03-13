import { EditorValidationBar } from "@sama-communications.ui-kit";

import { useEditorValidation } from "@hooks/components/useEditorValidation";

export default function ChatEditorValidation({ setLogs }) {
  const {
    statusNode,
    tooltipContent,
    onCheck,
    onSave,
    saveDisabled,
    testMessageRef,
  } = useEditorValidation(setLogs);

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
        className="ui:bg-hover-light/50 ui:h-full ui:w-40 ui:rounded-sm ui:px-2 ui:font-light ui:text-black ui:focus:outline-none"
        placeholder="message"
        defaultValue="message"
      />
    </EditorValidationBar>
  );
}
