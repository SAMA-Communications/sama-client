import * as m from "motion/react-m";

import { CHAT_CONTENT_TABS } from "@utils/global/chatContentTabs.js";

import Messages from "@icons/chat/Messages.svg?react";
import Apps from "@icons/chat/Apps.svg?react";

export default function ChatFormNavigation({ currentTab, changeTabFunc }) {
  return (
    <div className="flex flex-shrink gap-2 pb-[5px]">
      <m.button
        className={`flex gap-1 items-center px-2 py-1 cursor-pointer border-b rounded-lg ${
          currentTab === "messages" ? "border-lightgray" : "border-[#f6f6f6]"
        }`}
        onClick={() => changeTabFunc(CHAT_CONTENT_TABS.MESSAGES)}
        animate={{ scale: [0.8, 1.02, 1], opacity: [0, 1] }}
        whileTap={{ scale: 0.98, backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        transition={{ duration: 0.3 }}
      >
        <Messages /> <p>Messages</p>
      </m.button>
      <m.button
        className={`flex gap-1 items-center px-2 py-1 cursor-pointer border-b rounded-lg ${
          currentTab === "apps" ? "border-lightgray" : "border-[#f6f6f6]"
        }`}
        onClick={() => changeTabFunc(CHAT_CONTENT_TABS.APPS)}
        animate={{ scale: [0.8, 1.02, 1], opacity: [0, 1] }}
        whileTap={{ scale: 0.98, backgroundColor: "rgba(0, 0, 0, 0.25)" }}
        transition={{ duration: 0.3 }}
      >
        <Apps /> <p>Apps</p>
      </m.button>
    </div>
  );
}
