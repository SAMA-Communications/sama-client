export default function ChatFormNavigation({ changeTabFunc }) {
  const buttonStyle =
    "px-2 py-1 cursor-pointer border-b border-l border-r border-t border-lightgray rounded-lg";

  return (
    <div className="flex flex-shrink gap-2">
      <button className={buttonStyle} onClick={() => changeTabFunc("chat")}>
        <p>Chat</p>
      </button>
      <button className={buttonStyle} onClick={() => changeTabFunc("apps")}>
        <p>Apps</p>
      </button>
      //temporary buttons
    </div>
  );
}
