export default function ContextLink({ text, icon, onClick, isDangerStyle }) {
  return (
    <div
      key={text}
      className={`context-menu__link${isDangerStyle ? "--danger" : ""}`}
      onClick={onClick}
    >
      {icon} <p className="context-menu__text">{text}</p>
    </div>
  );
}
