import { useState } from "react";
import { Tooltip } from "react-tooltip";

import { getAdapters } from "../../../adapters";

import { OvalLoader } from "../OvalLoader";

import { Sparkles, CloudFog, ScrollText } from "lucide-react";

import { MagicButtonProps } from "./MagicButton.type";

interface Action {
  label: string;
  customStyle?: string;
  icon?: React.ReactNode;
  onClick?: () => void | Promise<void>;
}

export const MagicButton = ({ inputTextRef, isBlockedConv }: MagicButtonProps) => {
  const { useConversations, useMessages } = getAdapters();
  const { getSelectedConversation } = useConversations();
  const { summarizeMessages, changeMessageTone } = useMessages();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const selectedConversation = getSelectedConversation();
  const selectedCID = selectedConversation._id;

  const renderActions = (actions: Action[], customStyle: string = "") =>
    actions.map((action: Action, index: number) => (
      <button
        key={index}
        className={`z-6 flex cursor-pointer items-center gap-[7px] ${customStyle} ${action.customStyle}`}
        onClick={action.onClick}
      >
        {action.icon}
        {action.label}
      </button>
    ));

  const summarizeActionOnClick = async (filter: string) => {
    setIsOpen(false);
    await summarizeMessages(selectedCID, filter);
  };

  const changeToneActionOnClick = async (tone: string) => {
    setIsOpen(false);
    const body = inputTextRef.current.value;
    if (!body.length) {
      console.log("No text to change.");
      // showCustomAlert("No text to change.");
      return;
    }
    setIsLoading(true);
    const modifiedMessage = await changeMessageTone(body, tone);
    if (modifiedMessage) {
      inputTextRef.current.value = modifiedMessage;
      console.log("Message formatted.");
      // showCustomAlert("Message formatted.", "success");
    }
    setIsLoading(false);
  };

  return (
    <div className="magic-wand ui:flex ui:items-center ui:justify-center ui:rounded-xl">
      {isLoading ? (
        <OvalLoader width={28} height={28} />
      ) : (
        <Sparkles
          size={28}
          data-tooltip-id="editor-options-tooltip"
          data-tooltip-delay-hide={500}
          color="var(--color-accent-500)"
          className="ui:cursor-pointer"
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
        <div className="ui:z-10 ui:flex ui:flex-col ui:justify-start ui:gap-2">
          {renderActions(
            [
              {
                label: "Get summary:",
                customStyle: "ui:pb-1.25 ui:text-left! ui:text-black/80! ui:cursor-auto!",
                icon: <ScrollText size={15} />,
              },
              // {
              //   label: "- unreads",
              //   onClick: async () => await summarizeActionOnClick("unreads"),
              //   customStyle:
              //     "ui:-mt-2.5! ui:ml-2.5! ui:text-left! ui:hover:text-accent-500!",
              // },
              {
                label: "- last day",
                onClick: async () => await summarizeActionOnClick("last-day"),
                customStyle: "ui:-mt-2.5! ui:ml-2.5! ui:text-left! ui:hover:text-accent-500!",
              },
              {
                label: "- last 7 days",
                onClick: async () => await summarizeActionOnClick("last-7-days"),
                customStyle: "ui:-mt-2.5! ui:ml-2.5! ui:text-left! ui:hover:text-accent-500!",
              },
              ...(isBlockedConv
                ? []
                : [
                    {
                      label: "Change tone:",
                      customStyle: "ui:pb-1.25 ui:text-left! ui:text-black/80! ui:cursor-auto!",
                      icon: <CloudFog size={15} />,
                    },
                    {
                      label: "- positive",
                      onClick: async () => await changeToneActionOnClick("positive"),
                      customStyle: "ui:-mt-2.5! ui:ml-2.5! ui:text-left! ui:hover:text-accent-500!",
                    },
                    {
                      label: "- negative",
                      onClick: async () => await changeToneActionOnClick("negative"),
                      customStyle: "ui:-mt-2.5! ui:ml-2.5! ui:text-left! ui:hover:text-accent-500!",
                    },
                    {
                      label: "- cringe",
                      onClick: async () => await changeToneActionOnClick("cringe"),
                      customStyle: "ui:-mt-2.5! ui:ml-2.5! ui:text-left! ui:hover:text-accent-500!",
                    },
                  ]),
            ],
            " ui:text-text-dark",
          )}
        </div>
      </Tooltip>
    </div>
  );
};
