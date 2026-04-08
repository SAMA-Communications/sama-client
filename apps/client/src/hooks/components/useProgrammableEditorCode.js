import { useEffect, useMemo, useState } from "react";

import { useSelector } from "react-redux";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { getConverastionById } from "@store/values/Conversations.js";
import { selectParticipantsEntities } from "@store/values/Participants.js";

import { DEFAULT_EDITOR_CODE } from "@utils/constants.js";
import { getFormatedTime } from "@utils/FormatedUtils.js";
import { getUserFullName } from "@utils/UserUtils.js";

export function useProgrammableEditorCode(selectedCid) {
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const [editorCode, setEditorCode] = useState(selectedConversation?.handler_options?.content || DEFAULT_EDITOR_CODE);

  useEffect(() => {
    if (!selectedCid) return;
    const fetchAndSyncHandler = async () => {
      const localStorageCode = await conversationHandlerService.getHandlerFromLocalStorage(selectedCid);
      if (localStorageCode) {
        setEditorCode(localStorageCode);
      } else {
        conversationHandlerService.syncConversationHandler(selectedCid);
      }
    };
    fetchAndSyncHandler();
  }, [selectedCid]);

  useEffect(() => {
    if (selectedConversation?.handler_options?.content != null) {
      setEditorCode(selectedConversation.handler_options.content);
    }
  }, [selectedConversation?.handler_options?.content]);

  const codeStatusText = useMemo(() => {
    const handlerOptions = selectedConversation?.handler_options;
    if (!handlerOptions) return "none";
    const { updated_by, updated_at } = handlerOptions;
    if (!updated_at) return "Not saved";
    const date = getFormatedTime(updated_at);
    const user = participants[updated_by] || { first_name: "Unknown" };
    return `${date} by ${getUserFullName(user)}`;
  }, [selectedConversation, participants]);

  const handleEditorDidMount = (editor, monaco) => {
    const uri = monaco.Uri.parse(`file://${selectedCid}`);
    let model = monaco.editor.getModel(uri);
    if (!model) {
      model = monaco.editor.createModel(editorCode, "javascript", uri);
    }
    editor.setModel(model);
  };

  return { editorCode, setEditorCode, codeStatusText, handleEditorDidMount };
}
