import Messages from "@icons/chat/Messages.svg?react";
import Apps from "@icons/chat/Apps.svg?react";

export default function ChatFormNavigation({ currentTab, changeTabFunc }) {
  return (
    <div className="flex flex-shrink gap-2">
      <button
        className={`flex gap-1 items-center px-2 py-1 cursor-pointer border-b rounded-lg ${
          currentTab === "messages" ? "border-lightgray" : "border-[#f6f6f6]"
        }`}
        onClick={() => changeTabFunc("messages")}
      >
        <Messages /> <p>Messages</p>
      </button>
      <button
        className={`flex gap-1 items-center px-2 py-1 cursor-pointer border-b rounded-lg ${
          currentTab === "apps" ? "border-lightgray" : "border-[#f6f6f6]"
        }`}
        onClick={() => changeTabFunc("apps")}
      >
        <Apps /> <p>Apps</p>
      </button>
    </div>
  );
}
