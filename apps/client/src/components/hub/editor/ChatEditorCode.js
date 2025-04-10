import Editor, { useMonaco } from "@monaco-editor/react";
import conversationSchemeService from "@services/conversationSchemeService.js";
import getFromatedTime from "@utils/time/get_fromated_time.js";
import getUserFullName from "@utils/user/get_user_full_name.js";
import globalConstants from "@utils/global/constants.js";
import { constrainedEditor } from "constrained-editor-plugin";
import { getConverastionById } from "@store/values/Conversations.js";
import { selectParticipantsEntities } from "@store/values/Participants.js";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function ChatEditorCode() {
  const monaco = useMonaco();
  const participants = useSelector(selectParticipantsEntities);
  const selectedConversation = useSelector(getConverastionById);
  const selectedCid = selectedConversation._id;
  const [editorCode, setEditorCode] = useState(
    selectedConversation.scheme_options?.scheme ||
      globalConstants.defaultEditorCode
  );

  useEffect(() => {
    conversationSchemeService
      .getSchemeFromLocalStorage(selectedCid)
      .then((localStorageCode) => {
        if (localStorageCode) {
          setEditorCode(localStorageCode);
          // return;
        }
        conversationSchemeService.syncConversationScheme(selectedCid);
      });
  }, [selectedCid]);

  useEffect(() => {
    if (selectedConversation.scheme_options) {
      setEditorCode(selectedConversation.scheme_options?.scheme);
    }
  }, [selectedConversation]);

  const codeStatusView = useMemo(() => {
    const schemeOptions = selectedConversation?.scheme_options;
    if (!schemeOptions) return "none";

    const { updated_by, updated_at, not_saved } = schemeOptions;
    if (not_saved || !updated_at) return "Not saved";

    const date = getFromatedTime(updated_at);
    const user = participants[updated_by] || { first_name: "Unknown" };
    return `${date} by ${getUserFullName(user)}`;
  }, [selectedConversation]);

  const handleEditorDidMount = (editor, monaco) => {
    const constrainedInstance = constrainedEditor(monaco);
    const uri = monaco.Uri.parse(`file://${selectedCid}`);

    let model = monaco.editor.getModel(uri);
    if (!model) {
      model = monaco.editor.createModel(editorCode, "javascript", uri);
    }
    editor.setModel(model);

    constrainedInstance.initializeIn(editor);

    const restrictions = [];
    const totalLines = model.getLineCount();
    const validLine = Math.max(1, totalLines - 4);
    const restrictedColumn = model.getLineMaxColumn(validLine);
    restrictions.push({
      range: [5, 1, totalLines - 4, restrictedColumn],
      allowMultiline: true,
    });
    constrainedInstance.addRestrictionsTo(model, restrictions);
  };

  useEffect(() => {
    setTimeout(() => {
      const uri = monaco?.Uri.parse(`file://${selectedCid}`);
      const model = monaco?.editor.getModel(uri);

      if (model && editorCode && typeof editorCode === "string") {
        model.setValue(editorCode);
      }
    }, 300);
  }, [monaco, editorCode]);

  return (
    <div className="relative flex grow-3 items-end">
      <div className="absolute top-0 left-0 h-[calc(100%)] w-full pt-4 pb-4">
        <Editor
          height="100%"
          theme="custom"
          wrapperProps={{ className: `pb-[35px]` }}
          defaultLanguage="javascript"
          value={editorCode}
          path={selectedCid}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 16,
            scrollBeyondLastLine: false,
            minimap: { enabled: false },
            automaticLayout: true,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
          }}
        />
        <div className="w-full h-[25px] mt-[-25px] text-end">
          <p className="text-gray-400">Recent changes - {codeStatusView}</p>
        </div>
      </div>
    </div>
  );
}
