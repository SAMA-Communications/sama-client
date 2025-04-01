import conversationSchemeService from "@services/conversationSchemeService.js";
import globalConstants from "@utils/global/constants.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { useMonaco } from "@monaco-editor/react";
import { useSelector } from "react-redux";

import Help from "@icons/editor/Help.svg?react";

export default function ChatEditorHelper() {
  const monaco = useMonaco();
  const selectedCid = useSelector(getSelectedConversationId);

  const deleteConversationScheme = async () => {
    if (window.confirm("Are you sure you want to delete the scheme?")) {
      const editor = monaco.editor.getModels()[0];
      if (editor) editor.setValue(globalConstants.defaultEditorCode);
      await conversationSchemeService.deleteConversationScheme(selectedCid);
    }
  };

  return (
    <div className="h-full py-3 flex items-center gap-4">
      <Help className="mr-auto h-[30px] w-[30px]" />
      <span className="w-[1px] h-full bg-gray-400"></span>
      <button
        className="text-gray-400 underline cursor-pointer"
        onClick={deleteConversationScheme}
      >
        Delete scheme
      </button>
    </div>
  );
}
