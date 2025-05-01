import { motion as m, useAnimate } from "framer-motion";
import { useEffect } from "react";

export default function AnimatedBGbig({ customClassName = "", isTriggered }) {
  const [scope, animate] = useAnimate();

  useEffect(() => {
    isTriggered && animate([["path", { pathLength: 0 }, { duration: 0.35 }]]);
  }, [isTriggered, animate]);

  const drawPath = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: { duration: 2.2, ease: "easeInOut" },
    },
  };

  return (
    <div className={customClassName}>
      <svg
        ref={scope}
        className="h-dvh w-auto absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 "
        width="1986"
        height="1200"
        viewBox="0 0 1986 1200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <m.path
          d="M1592.92 1493.25C1523.26 1423.23 1257.32 1232.29 1174.95 1073.12C1092.58 913.948 1071.92 721.149 1098.7 538.216C1125.49 355.283 1229.73 139.852 1335.66 -24.4781C1441.59 -188.808 1667.83 -377.215 1734.26 -447.763"
          stroke="url(#paint0_linear_3057_352)"
          strokeOpacity="0.3"
          strokeWidth="500"
          strokeLinecap="round"
          variants={drawPath}
          initial="hidden"
          animate="visible"
        />
        <m.path
          d="M187.81 -24C146.955 17.8498 -2.56212 109.158 2.10697 166.226C6.77607 223.294 190.94 101.607 209.033 235.4C227.126 369.192 57.4994 632.339 84.3467 774.374C111.194 916.41 259.862 782.098 331.066 881.016C402.27 979.934 391.075 1148.54 408 1224"
          stroke="url(#paint1_linear_3057_352)"
          strokeWidth="2.43101"
          strokeLinecap="round"
          variants={drawPath}
          initial="hidden"
          animate="visible"
        />
        <m.path
          d="M181.451 -14C149.25 29.1576 31.4042 123.32 35.0843 182.171C38.7644 241.022 183.918 115.532 198.179 253.506C212.439 391.479 78.7434 662.849 99.9038 809.323C121.064 955.798 238.241 817.289 294.362 919.298C350.484 1021.31 341.66 1195.19 355 1273"
          stroke="url(#paint2_linear_3057_352)"
          strokeWidth="2.43101"
          strokeLinecap="round"
          variants={drawPath}
          initial="hidden"
          animate="visible"
        />
        <m.path
          d="M731 1230C822.799 1164.63 1282.45 907.09 1364.1 779.2C1445.74 651.31 1257.51 446.252 1294.06 348C1330.62 249.748 1571.13 152.35 1616.22 101.6C1661.3 50.85 1606.64 13.022 1605.01 -2"
          stroke="url(#paint3_linear_3057_352)"
          strokeWidth="2.1"
          strokeLinecap="round"
          variants={drawPath}
          initial="hidden"
          animate="visible"
        />
        <m.path
          d="M778 1279C865.021 1206.95 1300.75 923.065 1378.15 782.095C1455.54 641.126 1277.1 415.096 1311.76 306.795C1346.41 198.495 1574.4 91.1358 1617.14 35.1955C1659.88 -20.7449 1608.06 -62.4417 1606.52 -79"
          stroke="url(#paint4_linear_3057_352)"
          strokeWidth="2.1"
          strokeLinecap="round"
          variants={drawPath}
          initial="hidden"
          animate="visible"
        />
        <defs>
          <linearGradient
            id="paint0_linear_3057_352"
            x1="-949.242"
            y1="-2174.58"
            x2="-1178.27"
            y2="-2774.45"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B0B1F0" />
            <stop offset="1" stopColor="#CDCEF6" />
          </linearGradient>
          <linearGradient
            id="paint1_linear_3057_352"
            x1="-171.719"
            y1="-159.273"
            x2="-511.32"
            y2="84.9418"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B0B1F0" />
            <stop offset="1" stopColor="#CDCEF6" />
          </linearGradient>
          <linearGradient
            id="paint2_linear_3057_352"
            x1="-101.921"
            y1="-153.5"
            x2="-413.795"
            y2="17.9121"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B0B1F0" />
            <stop offset="1" stopColor="#CDCEF6" />
          </linearGradient>
          <linearGradient
            id="paint3_linear_3057_352"
            x1="-1491"
            y1="310.646"
            x2="-2354.47"
            y2="574.76"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B0B1F0" />
            <stop offset="1" stopColor="#CDCEF6" />
          </linearGradient>
          <linearGradient
            id="paint4_linear_3057_352"
            x1="-1328.34"
            y1="265.621"
            x2="-2165.53"
            y2="485.843"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#B0B1F0" />
            <stop offset="1" stopColor="#CDCEF6" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
