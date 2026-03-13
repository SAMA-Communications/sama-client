import { useDispatch, useSelector } from "react-redux";

import { useMonaco } from "@monaco-editor/react";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { getConversationHandler } from "@store/values/Conversations.js";
import { updateHandler, upsertChat } from "@store/values/Conversations.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";

import { DEFAULT_EDITOR_CODE } from "@utils/constants.js";

export function useEditorHelperActions() {
  const monaco = useMonaco();
  const dispatch = useDispatch();
  const selectedCid = useSelector(getSelectedConversationId);
  const selectedConversationScheme = useSelector(getConversationHandler);

  const resetEditorContent = (content) => {
    const model = conversationHandlerService.getHandlerModelByCid(monaco, selectedCid);
    if (model) model.setValue(content);
    if (selectedCid) localStorage.removeItem(`conversation_handler_${selectedCid}`);
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

  return {
    actions: [
      { label: "Delete content", onClick: deleteConversationHandler },
      { label: "Undo", onClick: undoHandlerChanges },
    ],
  };
}
