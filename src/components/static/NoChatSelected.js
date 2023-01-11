import { animateSVG } from "../../styles/animations/animationSVG.js";
import { changeOpacity } from "../../styles/animations/animationBlocks.js";
import { motion as m } from "framer-motion";

export default function NoChatSelected() {
  return (
    <m.div
      variants={changeOpacity(1.2, 1, 0, 0.15)}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="chat-form-loading"
    >
      <svg
        id="chat-form-loading-icon"
        width="64"
        height="64"
        viewBox="0 0 92 92"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <m.path
          variants={animateSVG(260, 1.2, 1.5, 0, 0.25)}
          initial="hidden"
          animate="visible"
          exit="exit"
          d="M32.5834 72.8333H30.6667C15.3334 72.8333 7.66669 69 7.66669 49.8333V30.6667C7.66669 15.3333 15.3334 7.66666 30.6667 7.66666H61.3334C76.6667 7.66666 84.3334 15.3333 84.3334 30.6667V49.8333C84.3334 65.1667 76.6667 72.8333 61.3334 72.8333H59.4167C58.2284 72.8333 57.0784 73.4083 56.35 74.3667L50.6 82.0333C48.07 85.4067 43.93 85.4067 41.4 82.0333L35.65 74.3667C35.0367 73.5233 33.6184 72.8333 32.5834 72.8333V72.8333Z"
          stroke="var(--icon-stroke-color)"
        />
        <m.path
          variants={animateSVG(0, 0, 0, 0, 0.25)}
          exit="exit"
          d="M61.318 42.1667H61.3564M45.9809 42.1667H46.0192M30.6475 42.1667H30.6782"
          stroke="var(--icon-stroke-color)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <p>Select your chat ...</p>
    </m.div>
  );
}
