import { Tooltip } from "react-tooltip";
import { useState } from "react";
import { useSelector } from "react-redux";

import aiService from "@services/tools/AIService.js";

import { OvalLoader } from "@sama-communications.ui-kit";

import { getConverastionById } from "@store/values/Conversations.js";

import { showCustomAlert } from "@utils/GeneralUtils.js";

import { WandSparkles, CloudFog, ScrollText } from "lucide-react";

export default function MagicButton({ inputTextRef, isBlockedConv }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = useSelector(getConverastionById);
  const selectedCID = selectedConversation._id;

  const renderActions = (actions, customStyle = "") =>
    actions.map((action, index) => (
      <button
        key={index}
        className={`z-6 flex cursor-pointer items-center gap-[7px] ${customStyle} ${action.customStyle}`}
        onClick={action.onClick}
      >
        {action.icon}
        {action.label}
      </button>
    ));

  const summarizeActionOnClick = async (filter) => {
    setIsOpen(false);
    await aiService.summarizeMessages({ cid: selectedCID, filter });
  };

  const changeToneActionOnClick = async (tone) => {
    setIsOpen(false);
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
    <div className="magic-wand border-text-dark flex items-center justify-center rounded-xl border p-2">
      {isLoading ? (
        <OvalLoader width={28} height={28} />
      ) : (
        <WandSparkles
          size={28}
          data-tooltip-id="editor-options-tooltip"
          data-tooltip-delay-hide={500}
          color="var(--color-text-dark)"
          className="cursor-pointer"
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
        <div className="z-10 flex flex-col justify-start gap-2">
          {renderActions(
            [
              {
                label: "Get summary:",
                customStyle: "!pb-[5px] !text-left !text-black/80 !cursor-auto",
                icon: <ScrollText className="h-3.75 w-3.75" />,
              },
              // {
              //   label: "- unreads",
              //   onClick: async () => await summarizeActionOnClick("unreads"),
              //   customStyle:
              //     "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-500",
              // },
              {
                label: "- last day",
                onClick: async () => await summarizeActionOnClick("last-day"),
                customStyle: "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-500",
              },
              {
                label: "- last 7 days",
                onClick: async () => await summarizeActionOnClick("last-7-days"),
                customStyle: "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-500",
              },
              ...(isBlockedConv
                ? []
                : [
                    {
                      label: "Change tone:",
                      customStyle: "!pb-[5px] !text-left !text-black/80 !cursor-auto",
                      icon: <CloudFog className="h-3.75 w-3.75" />,
                    },
                    {
                      label: "- positive",
                      onClick: async () => await changeToneActionOnClick("positive"),
                      customStyle: "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-500",
                    },
                    {
                      label: "- negative",
                      onClick: async () => await changeToneActionOnClick("negative"),
                      customStyle: "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-500",
                    },
                    {
                      label: "- cringe",
                      onClick: async () => await changeToneActionOnClick("cringe"),
                      customStyle: "!-mt-[10px] !ml-[10px] !text-left hover:!text-accent-500",
                    },
                  ]),
            ],
            "text-p !text-(--color-text-dark)",
          )}
        </div>
      </Tooltip>
    </div>
  );
}
