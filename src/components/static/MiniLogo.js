import { animateSVG } from "../../styles/animations/animationSVG.js";
import { changeOpacity } from "../../styles/animations/animationBlocks.js";
import { motion as m } from "framer-motion";

export default function MiniLogo() {
  return (
    <>
      <svg
        width="45"
        height="44"
        viewBox="0 0 45 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <m.path
          variants={animateSVG(219, 0.1, 2.1, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          d="M36.7092 21.58V29.58C36.7092 30.1 36.6887 30.6 36.6275 31.08C36.1579 36.48 32.9117 39.16 26.9296 39.16H26.1129C25.6025 39.16 25.1125 39.4 24.8062 39.8L22.3562 43C21.2742 44.42 19.5183 44.42 18.4362 43L15.9862 39.8C15.8228 39.6136 15.6231 39.461 15.3987 39.3511C15.1744 39.2412 14.9299 39.1762 14.6796 39.16H13.8629C7.34999 39.16 4.08333 37.58 4.08333 29.58V21.58C4.08333 15.72 6.83958 12.54 12.3317 12.08C12.8217 12.02 13.3321 12 13.8629 12H26.9296C33.4425 12 36.7092 15.2 36.7092 21.58Z"
          stroke="var(--icon-stroke-color)"
        />
        <m.path
          variants={animateSVG(209, 0.1, 2.1, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          d="M44.8758 13.58V21.58C44.8758 27.46 42.1196 30.62 36.6275 31.08C36.6888 30.6 36.7092 30.1 36.7092 29.58V21.58C36.7092 15.2 33.4425 12 26.9296 12H13.8629C13.3321 12 12.8217 12.02 12.3317 12.08C12.8012 6.7 16.0475 4 22.0296 4H35.0963C41.6092 4 44.8758 7.2 44.8758 13.58V13.58Z"
          stroke="var(--icon-stroke-color)"
        />
        <m.path
          variants={animateSVG(19, 0.1, 2.1, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          d="M27.5523 26.5H27.5727M20.4065 26.5H20.4269M13.2606 26.5H13.281"
          stroke="var(--icon-stroke-color)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <m.p
        variants={changeOpacity(0.1, 1, 0, 0.25)}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        SAMA
      </m.p>
    </>
  );
}
