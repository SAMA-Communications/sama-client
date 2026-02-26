import { Tooltip } from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";
import { useMonaco } from "@monaco-editor/react";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { getConversationHandler } from "@store/values/Conversations.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateHandler, upsertChat } from "@store/values/Conversations.js";

import { DEFAULT_EDITOR_CODE } from "@utils/constants.js";

import { Info, ListStart } from "lucide-react";

export default function ChatEditorHelper() {
  const monaco = useMonaco();
  const dispatch = useDispatch();

  const selectedCid = useSelector(getSelectedConversationId);
  const selectedConversationScheme = useSelector(getConversationHandler);

  const resetEditorContent = (content) => {
    const model = conversationHandlerService.getHandlerModelByCid(monaco, selectedCid);
    if (model) model.setValue(content);
    localStorage.removeItem(`conversation_handler_${selectedCid}`);
  };

  const deleteConversationHandler = async () => {
    if (window.confirm("Are you sure you want to delete the handler?")) {
      resetEditorContent(DEFAULT_EDITOR_CODE);
      dispatch(upsertChat({ _id: selectedCid, handler_options: null }));
      await conversationHandlerService.deleteConversationHandler(selectedCid);
    }
  };

  const undoHandlerChanges = () => {
    resetEditorContent(selectedConversationScheme?.content || DEFAULT_EDITOR_CODE);
    dispatch(updateHandler({ _id: selectedCid, not_saved: null }));
  };

  const renderActions = (actions, customStyle = "") =>
    actions.map((action, index) => (
      <button
        key={index}
        className={`cursor-pointer text-black/40 underline underline-offset-4 ${customStyle}`}
        onClick={action.onClick}
      >
        {action.label}
      </button>
    ));

  return (
    <div className="editor-helper shadow-btn flex h-full items-center gap-2.75 rounded-xl bg-white p-2">
      <a
        href="https://oleksandr-ch.notion.site/Programmable-Chat-feature-1ffe3b41e4ae804da619f63b706e7263"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Info size={28} color="var(--color-text-dark)" />
      </a>
      <span className="h-full w-px bg-gray-400"></span>
      <ListStart
        color="var(--color-text-dark)"
        data-tooltip-id="editor-options-tooltip"
        data-tooltip-delay-hide={500}
        size={28}
      />
      <Tooltip
        clickable
        id="editor-options-tooltip"
        className="editor-tooltip-style"
        classNameArrow="editor-tooltip-arrow"
      >
        <div className="flex flex-col gap-2">
          {renderActions(
            [
              {
                label: "Delete content",
                onClick: deleteConversationHandler,
              },
              { label: "Undo", onClick: undoHandlerChanges },
            ],
            "!no-underline text-p !text-(--color-text-dark)",
          )}
        </div>
      </Tooltip>
    </div>
  );
}
