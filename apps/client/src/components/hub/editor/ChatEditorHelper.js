import conversationHandlerService from "@services/conversationHandlerService.js";
import globalConstants from "@utils/global/constants.js";
import { Tooltip } from "react-tooltip";
import { getConversationHandler } from "@store/values/Conversations.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateHandler, upsertChat } from "@store/values/Conversations.js";
import { useMonaco } from "@monaco-editor/react";
import { useSelector, useDispatch } from "react-redux";

import Help from "@icons/editor/Help.svg?react";

export default function ChatEditorHelper() {
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const selectedCid = useSelector(getSelectedConversationId);
  const selectedConversationScheme = useSelector(getConversationHandler);

  const resetEditorContent = (content) => {
    const model = conversationHandlerService.getHandlerModelByCid(
      monaco,
      selectedCid
    );
    if (model) model.setValue(content);
    localStorage.removeItem(`conversation_handler_${selectedCid}`);
  };

  const deleteConversationHandler = async () => {
    if (window.confirm("Are you sure you want to delete the handler?")) {
      resetEditorContent(globalConstants.defaultEditorCode);
      dispatch(upsertChat({ _id: selectedCid, handler_options: null }));
      await conversationHandlerService.deleteConversationHandler(selectedCid);
    }
  };

  const undoHandlerChanges = () => {
    resetEditorContent(
      selectedConversationScheme?.content || globalConstants.defaultEditorCode
    );
    dispatch(updateHandler({ _id: selectedCid, not_saved: null }));
  };

  return (
    <div className="h-full py-3 flex items-center gap-4">
      <Help
        data-tooltip-id="editor-help-tooltip"
        data-tooltip-delay-hide={500}
        className="mr-auto h-[30px] w-[30px]"
      />
      <Tooltip id="editor-help-tooltip">
        <div className="flex flex-col">
          <span>
            Below is a walkthrough on how to use the editor, plus some useful
            tips.
          </span>
          <span>-</span>
          <span>
            If you want to send a response message by bot:(&#123;message:
            &#123;body: "ur message"&#125;&#125;)
          </span>
          <span>
            If u want to change user body: return resolve(&#123;message:
            &#123;body: "ur message"&#125;&#125;, &#123;isReplaceBody:
            true&#125;)
          </span>
          <span>If u want to reject message: return reject("ur message")</span>
        </div>
      </Tooltip>
      <span className="w-[1px] h-full bg-gray-400"></span>
      <button
        className="text-gray-400 underline cursor-pointer"
        onClick={deleteConversationHandler}
      >
        Delete content
      </button>
      <button
        className="text-gray-400 underline cursor-pointer"
        onClick={undoHandlerChanges}
      >
        Undo
      </button>
    </div>
  );
}
