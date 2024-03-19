export default function ContextLink({
  text,
  icon,
  onClickFunc,
  isDangerStyle,
}) {
  return (
    <div
      key={text}
      className={`context-menu__link${isDangerStyle ? "--danger" : ""}`}
      onClick={onClickFunc}
    >
      {icon} <p className="context-menu__text">{text}</p>
    </div>
  );
}
