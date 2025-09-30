import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { useSelector } from "react-redux";

import aiService from "@services/tools/AIService.js";

import OvalLoader from "@components/_helpers/OvalLoader.js";

import { getConverastionById } from "@store/values/Conversations.js";

import showCustomAlert from "@utils/show_alert.js";

import MagicWand from "@icons/ai/MagicWand.svg?react";
import Summarize from "@icons/ai/Summarize.svg?react";
import ChangeTone from "@icons/ai/ChangeTone.svg?react";

export default function MagicButton({ inputTextRef }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation._id;

  const renderActions = (actions, customStyle = "") =>
    actions.map((action, index) => (
      <button
        key={index}
        className={`flex items-center gap-[7px] cursor-pointer z-6 ${customStyle} ${action.customStyle}`}
        onClick={action.onClick}
      >
        {action.icon}
        {action.label}
      </button>
    ));

  const summarizeActionOnClick = async (filter) =>
    await aiService.summarizeMessages({ cid: selectedCID, filter });

  const changeToneActionOnClick = async (tone) => {
    const body = inputTextRef.current.value;
    if (!body.length) {
      showCustomAlert("No text to change.");
      return;
    }
    setIsLoading(true);
    const modifiedMessage = await aiService.changeMessageTone({ body, tone });
    if (modifiedMessage) {
      inputTextRef.current.value = modifiedMessage;
      showCustomAlert("Message formatted.", "success");
    }
    setIsLoading(false);
  };

  return (
    <div className="magic-wand w-[60px] h-[60px] flex justify-center items-center rounded-[16px] bg-(--color-hover-light)">
      {isLoading ? (
        <OvalLoader width={27} height={27} />
      ) : (
        <MagicWand
          data-tooltip-id="editor-options-tooltip"
          data-tooltip-delay-hide={500}
          className="w-[27px] h-[27px] cursor-pointer"
          onClick={() => setIsOpen((s) => !s)}
        />
      )}
      <Tooltip
        clickable
        events={["click"]}
        isOpen={isOpen}
        id="editor-options-tooltip"
        className="editor-tooltip-style"
        classNameArrow="editor-tooltip-arrow"
      >
        <div className="flex flex-col justify-start gap-2 z-10">
          {renderActions(
            [
              {
                label: "Get summary:",
                customStyle: "!pb-[5px] !text-left !text-black/80 !cursor-auto",
                icon: <Summarize className="w-[15px] h-[15px]" />,
              },
              {
                label: "- unreads",
                onClick: async () => await summarizeActionOnClick("unreads"),
                customStyle:
                  "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-dark",
              },
              {
                label: "- last day",
                onClick: async () => await summarizeActionOnClick("last-day"),
                customStyle:
                  "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-dark",
              },
              {
                label: "- last 7 days",
                onClick: async () =>
                  await summarizeActionOnClick("last-7-days"),
                customStyle:
                  "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-dark",
              },
              {
                label: "Change tone:",
                customStyle: "!pb-[5px] !text-left !text-black/80 !cursor-auto",
                icon: <ChangeTone className="w-[15px] h-[15px]" />,
              },
              {
                label: "- positive",
                onClick: async () => await changeToneActionOnClick("positive"),
                customStyle:
                  "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-dark",
              },
              {
                label: "- negative",
                onClick: async () => await changeToneActionOnClick("negative"),
                customStyle:
                  "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-dark",
              },
              {
                label: "- cringe",
                onClick: async () => await changeToneActionOnClick("cringe"),
                customStyle:
                  "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-dark",
              },
            ],
            "text-p !text-(--color-text-dark)"
          )}
        </div>
      </Tooltip>
    </div>
  );
}
