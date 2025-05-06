import * as m from "motion/react-m";

export default function AnimatedBGmini({ customClassName = "" }) {
  const showPath = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: {
      opacity: 1,
      pathLength: 1,
      transition: { delay: 0.5, duration: 1, yoyo: Infinity, ease: "easeOut" },
    },
  };

  const showBg = {
    hidden: { opacity: 0, scale: 0, borderRadius: "400px" },
    visible: {
      opacity: 1,
      scale: 1,
      borderRadius: "24px",
      transition: { duration: 0.6, yoyo: Infinity, ease: "easeOut" },
    },
  };

  return (
    <m.div
      className={
        customClassName + " bg-linear-to-b from-[#C5C7FA] to-[#D4D5F7]"
      }
      variants={showBg}
      initial="hidden"
      animate="visible"
    >
      <svg
        className=" absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-auto"
        width="1091"
        height="526"
        viewBox="0 0 1091 526"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <m.path
          d="M66 445.996C147 409.996 293.229 344.661 366.5 296.496C439.771 248.332 492.671 181.029 546.207 175.306C599.742 169.584 675.368 245.416 750 284.996C824.632 324.577 920 357.996 975.5 378.996"
          stroke="url(#paint0_radial_3061_353)"
          strokeWidth="350"
          strokeLinecap="square"
          variants={showPath}
          initial="hidden"
          animate="visible"
        />
        <m.path
          d="M140 577.911C229.5 559.911 280.5 546.911 367 516.911C453.5 486.911 525.494 414.289 579 409.412C632.506 404.534 695.5 444.202 776 465.911C871.5 491.666 956.5 509.411 1010.5 516.911"
          stroke="url(#paint1_radial_3061_353)"
          strokeWidth="350"
          strokeLinecap="square"
          variants={showPath}
          initial="hidden"
          animate="visible"
        />
        <defs>
          <radialGradient
            id="paint0_radial_3061_353"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(631 371.5) rotate(-32.2964) scale(310.446 463.073)"
          >
            <stop stopColor="#B9BAF0" stopOpacity="0.42" />
            <stop offset="1" stopColor="#BABBFF" />
          </radialGradient>
          <radialGradient
            id="paint1_radial_3061_353"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(575 754) rotate(-151.877) scale(731.912 1008.5)"
          >
            <stop offset="0.00195268" stopColor="#B0B1F0" />
            <stop offset="1" stopColor="#8C8DDE" />
          </radialGradient>
        </defs>
      </svg>
    </m.div>
  );
}
