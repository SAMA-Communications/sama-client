import * as m from "motion/react-m";

export default function ContextLink({ text, icon, onClick, isDangerStyle }) {
  return (
    <m.div
      key={text}
      className={`hover:bg-hover-light/45 flex cursor-pointer items-center gap-1.75 rounded-lg p-1.25 ${
        isDangerStyle ? "mt-1.25" : ""
      }`}
      onClick={onClick}
      animate={{ height: [0, 35], opacity: [0, 1] }}
    >
      {icon} <p className={`text-text-dark text-nowrap ${isDangerStyle ? "text-danger!" : ""}`}>{text}</p>
    </m.div>
  );
}
