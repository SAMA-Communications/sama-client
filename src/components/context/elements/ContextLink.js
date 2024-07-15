import { animateContextLink } from "@src/animations/animateContextMenu";
import { motion as m } from "framer-motion";

export default function ContextLink({ text, icon, onClick, isDangerStyle }) {
  return (
    <m.div
      variants={animateContextLink}
      initial="hidden"
      animate="visible"
      exit="exit"
      key={text}
      className={`context-menu__link${isDangerStyle ? "--danger" : ""}`}
      onClick={onClick}
    >
      {icon} <p className="context-menu__text">{text}</p>
    </m.div>
  );
}
