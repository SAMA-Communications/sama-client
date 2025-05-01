import { Tooltip } from "react-tooltip";
import { useSelector, useDispatch } from "react-redux";
import { useMonaco } from "@monaco-editor/react";

import conversationHandlerService from "@services/conversationHandlerService.js";

import { getIsTabletView } from "@store/values/IsTabletView.js";
import { getConversationHandler } from "@store/values/Conversations.js";
import { getSelectedConversationId } from "@store/values/SelectedConversation.js";
import { updateHandler, upsertChat } from "@store/values/Conversations.js";

import globalConstants from "@utils/global/constants.js";

import Help from "@icons/editor/Help.svg?react";
import Options from "@icons/editor/Options.svg?react";

export default function ChatEditorHelper() {
  const monaco = useMonaco();
  const dispatch = useDispatch();

  const isTabletView = useSelector(getIsTabletView);

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

  const renderTooltipContent = (tips) =>
    tips.map((tip, index) => (
      <div key={index}>
        <p>{tip.label}</p>
        <p className="text-cyan-700 !font-normal">
          &nbsp;&nbsp;&nbsp;&nbsp;{tip.code}
        </p>
      </div>
    ));

  const renderActions = (actions, customStyle = "") =>
    actions.map((action, index) => (
      <button
        key={index}
        className={`text-black/40 underline underline-offset-4 cursor-pointer ${customStyle}`}
        onClick={action.onClick}
      >
        {action.label}
      </button>
    ));

  return (
    <div className="editor-helper h-full py-3 flex items-center xl:gap-2 max-xl:gap-[16px] xl:gap-4">
      <Help
        data-tooltip-id="editor-help-tooltip"
        data-tooltip-delay-hide={500}
        className="mr-auto h-[30px] w-[30px]"
      />
      <Tooltip
        id="editor-help-tooltip"
        className="editor-tooltip-style"
        classNameArrow="editor-tooltip-arrow"
      >
        <div>
          <p className="!font-normal text-p">
            Below is a walkthrough on how to use the editor, plus some useful
            tips.
          </p>
          <p>&nbsp;</p>
          {renderTooltipContent([
            {
              label: "If you want to send a response message by bot:",
              code: `return resolve({message: {body: "ur message"}})`,
            },
            {
              label: "If u want to change user body:",
              code: `return resolve({message: {body: "ur message"}}, {isReplaceBody: true})`,
            },
            {
              label: "If u want to reject message:",
              code: `return reject("ur message")`,
            },
            {
              label: "If u want to accept message:",
              code: `return accent()`,
            },
          ])}
        </div>
      </Tooltip>
      <span className="w-[1px] h-full bg-gray-400"></span>
      {isTabletView ? (
        <>
          <Options
            data-tooltip-id="editor-options-tooltip"
            data-tooltip-delay-hide={500}
            className="mr-auto h-[30px] w-[30px]"
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
                "!no-underline text-p !text-(--color-text-dark)"
              )}
            </div>
          </Tooltip>
        </>
      ) : (
        renderActions([
          { label: "Delete content", onClick: deleteConversationHandler },
          { label: "Undo", onClick: undoHandlerChanges },
        ])
      )}
    </div>
  );
}
