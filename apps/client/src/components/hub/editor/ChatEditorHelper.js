import conversationSchemeService from "@services/conversationSchemeService.js";
import globalConstants from "@utils/global/constants.js";
import { Tooltip } from "react-tooltip";
import { getConversationScheme } from "@store/values/Conversations.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateScheme, upsertChat } from "@store/values/Conversations.js";
import { useMonaco } from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";

import Help from "@icons/editor/Help.svg?react";

export default function ChatEditorHelper() {
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const selectedCid = useSelector(getSelectedConversationId);
  const selectedConversationScheme = useSelector(getConversationScheme);

  const resetEditorContent = (content) => {
    const uri = monaco?.Uri.parse(`file://${selectedCid}`);
    const model = monaco?.editor.getModel(uri);
    if (model) model.setValue(content);
    localStorage.removeItem(`conversation_scheme_${selectedCid}`);
  };

  const deleteConversationScheme = async () => {
    if (window.confirm("Are you sure you want to delete the scheme?")) {
      resetEditorContent(globalConstants.defaultEditorCode);
      dispatch(upsertChat({ _id: selectedCid, scheme_options: null }));
      await conversationSchemeService.deleteConversationScheme(selectedCid);
    }
  };

  const undoSchemeChanges = () => {
    resetEditorContent(
      selectedConversationScheme?.scheme || globalConstants.defaultEditorCode
    );
    dispatch(updateScheme({ _id: selectedCid, not_saved: null }));
  };

  return (
    <div className="h-full py-3 flex items-center gap-4">
      <Help
        data-tooltip-id="editor-help-tooltip"
        data-tooltip-delay-hide={500}
        className="mr-auto h-[30px] w-[30px]"
      />
      <Tooltip id="editor-help-tooltip">
        <div style={{ display: "flex", flexDirection: "column" }}>
          <span>
            Right here is a description of how to use the editor and some tips
          </span>
          <span>-</span>
          <span>
            If u want to change body: return resolve(&#123;body: "ur
            message"&#125;)
          </span>
          <span>
            If u want to reject message: return reject(&#123;message: "ur
            message"&#125; / "ur message")
          </span>
        </div>
      </Tooltip>
      <span className="w-[1px] h-full bg-gray-400"></span>
      <button
        className="text-gray-400 underline cursor-pointer"
        onClick={deleteConversationScheme}
      >
        Delete scheme
      </button>
      <button
        className="text-gray-400 underline cursor-pointer"
        onClick={undoSchemeChanges}
      >
        Undo
      </button>
    </div>
  );
}
