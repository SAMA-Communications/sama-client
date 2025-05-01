import { motion as m } from "framer-motion";

export default function ContextLink({ text, icon, onClick, isDangerStyle }) {
  return (
    <m.div
      key={text}
      className={`py-[3px] px-[13px] flex gap-[15px] items-center rounded-[8px] cursor-pointer hover:bg-(--color-hover-light) ${
        isDangerStyle ? "mt-[5px]" : ""
      }`}
      onClick={onClick}
      animate={{ height: [0, 35], opacity: [0, 1] }}
    >
      {icon}{" "}
      <p
        className={`text-black text-h6 text-nowrap ${
          isDangerStyle ? "!text-(--color-red)" : ""
        }`}
      >
        {text}
      </p>
    </m.div>
  );
}
