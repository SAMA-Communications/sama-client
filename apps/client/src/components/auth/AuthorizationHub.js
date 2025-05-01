import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion as m, useAnimate } from "framer-motion";

import SAMALogo from "@components/static/SAMALogo";
import AnimatedBGbig from "@components/auth/animations/AnimatedBGbig.js";
import AnimatedBGmini from "@components/auth/animations/AnimatedBGmini.js";

import PasswordInput from "@components/auth/elements/PasswordInput";
import UserNameInput from "@components/auth/elements/UserNameInput";
import ConfirmButton from "@components/auth/elements/ConfirmButton";

import { getIsMobileView } from "@store/values/IsMobileView.js";

import HeaderWaves from "@icons/_helpers/HeaderWaves.svg?react";
import Discord from "@icons/socials/DiscordIcon.svg?react";
import Medium from "@icons/socials/MediumIcon.svg?react";
import GitHub from "@icons/socials/GitHubIcon.png";

export default function AuthorizationHub({ showDemoMessage = false }) {
  const [page, setPage] = useState(
    localStorage.getItem("isUsedBefore") ? "login" : "signup"
  );
  const [content, setContent] = useState({});

  const [scope, animate] = useAnimate();
  const [triggerBGAnimation, setTriggerBGAnimation] = useState(false);

  const isMobileView = useSelector(getIsMobileView);

  const isLoginPage = page === "login";

  useEffect(() => setTriggerBGAnimation(false));
  const triggerExitAnimation = () => {
    animate([
      [scope.current, { opacity: 0, scale: [1, 1.05, 0.6] }, { duration: 0.4 }],
    ]);
    setTriggerBGAnimation(true);
  };

  return (
    <section className="w-dvw h-dvh flex flex-col justify-center items-center overflow-hidden">
      <AnimatedBGbig
        customClassName="absolute w-dvw h-dvh overflow-hidden z-0"
        isTriggered={triggerBGAnimation}
      />
      <m.div
        ref={scope}
        className={` relative max-w-[95dvw] w-[1200px] max-lg:w-[min(600px,95dvw)] max-h-[95dvh] h-[800px] max-lg:h-max max-lg:py-[4dvh] p-[20px] flex flex-row justify-center gap-[20px] rounded-[32px] bg-(--color-bg-light) shadow-lg shadow-white-100/90`}
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          transition: { delay: 0.1, duration: 0.9 },
        }}
      >
        <HeaderWaves className="lg:hidden absolute w-full top-0 rounded-t-[32px]" />
        <m.div
          className=" w-1/2 max-lg:w-full self-center flex flex-col gap-[20px] justify-center px-[70px] max-xl:p-[18px] max-sm:p-[5px] z-10"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: isMobileView ? [0, 1] : [0, 1.1, 1],
            transition: { delay: 0.3, duration: 0.9 },
          }}
        >
          <SAMALogo
            customClassName={
              "lg:hidden w-[190px] max-sm:w-[130px] bg-(--color-bg-light-90) p-[25px] max-sm:p-[20px] rounded-[60px] max-sm:rounded-full self-center -mt-[120px] max-sm:-mt-[90px] shadow-md z-20"
            }
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: [0, 1.2, 1],
              transition: { delay: 1, duration: 0.5 },
            }}
          />
          <m.div
            key={isLoginPage ? "login" : "signup"}
            className="w-full"
            animate={{ scale: [1.02, 1] }}
            exit={{ scale: [1, 1.02] }}
            transition={{ duration: 0.2 }}
          >
            <p className="text-h1 max-md:text-h2 max-sm:text-h3 !font-medium">
              {isLoginPage ? "Welcome back!" : "Create an account"}
            </p>
            <p className="text-h6">
              {isLoginPage ? "Don`t have account?" : "Already have an account?"}
              &nbsp;
              <span
                className="text-(--color-accent-dark) !font-normal cursor-pointer hover:text-(--color-accent-light-50) transition-colors duration-200"
                onClick={() => setPage(isLoginPage ? "signup" : "login")}
              >
                {isLoginPage ? "Sign up" : "Log in"}
              </span>
            </p>
          </m.div>
          {showDemoMessage ? (
            <div className="py-[10px] px-[20px] text-white text-center rounded-lg bg-(--color-accent-dark) ">
              <p className="!font-light text-h6">Welcome to the SAMA demo.</p>
              <p className="mt-[10px]">
                You can connect using the following credentials:
                <br></br>
                <b>sama-user-1</b> or <b>sama-user-2</b> and{" "}
                <b>demo-password</b>
              </p>
            </div>
          ) : null}
          <div className="sm:mt-[25px] flex-1 flex flex-col gap-[15px]">
            <UserNameInput setState={setContent} />
            <PasswordInput setState={setContent} />
            <ConfirmButton
              page={page}
              content={content}
              onClickEvent={triggerExitAnimation}
            />
          </div>
          <div className="w-full flex flex-row items-center gap-[10px]">
            <span className="flex-1 h-[1px] rounded-[2px] bg-gray-700/30"></span>
            <p className="text-gray-700/80">Our socials</p>
            <span className="flex-1 h-[1px] rounded-[2px] bg-gray-700/30"></span>
          </div>
          <div className="flex flex-row gap-[15px]">
            <a
              href="https://github.com/SAMA-Communications"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-row gap-[10px] justify-center items-center py-[7px] px-[14px] border border-gray-700/30 rounded-lg hover:bg-(--color-hover-light) transition-colors cursor-pointer"
            >
              <img className="w-[28px] h-[28px]" src={GitHub} alt="" />
              <p className="!font-light">GitHub</p>
            </a>
            <a
              href="https://medium.com/sama-communications"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-row gap-[10px] justify-center items-center py-[7px] px-[14px] border border-gray-700/30 rounded-lg hover:bg-(--color-hover-light) transition-colors cursor-pointer"
            >
              <Medium className="w-[28px] h-[28px]" />
              <p className="!font-light">Medium</p>
            </a>
            <a
              href="https://discord.gg/WSCQhFg65J"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-row gap-[10px] justify-center items-center py-[7px] px-[14px] border border-gray-700/30 rounded-lg hover:bg-(--color-hover-light) transition-colors cursor-pointer"
            >
              <Discord className="w-[28px] h-[28px]" />
              <p className="!font-light">Discord</p>
            </a>
          </div>
        </m.div>
        <div className="relative max-lg:hidden w-1/2 flex flex-col items-center justify-center rounded-[24px] py-[10px] px-[20px] overflow-hidden">
          <AnimatedBGmini customClassName="absolute w-full h-full top-0 left-0 z-0" />
          <div className="w-full flex flex-row justify-center items-center z-10">
            <m.p
              className="text-h3 text-stone-900/60 !font-(family-name:--accent-font)"
              initial={{ opacity: 0, y: -20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1.2, duration: 0.5 },
              }}
            >
              SAMA
            </m.p>
          </div>
          <div className="flex-1 pt-[50px] z-10">
            <SAMALogo
              customClassName="w-[250px] bg-(--color-bg-light-50) p-[35px] rounded-[112px]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: [0, 1.2, 1],
                transition: { delay: 0.8, duration: 0.5 },
              }}
            />
          </div>
          <div className="flex flex-col items-center justify-center gap-[30px] z-10">
            <m.div
              className="text-center text-white text-h4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { delay: 1.2, duration: 0.5 },
              }}
            >
              <p>Simple but Advanced</p>
              <p>Messaging Alternative</p>
            </m.div>
            <m.div
              className="w-[120px] h-[6px] mb-[15px] rounded-full bg-gray-300/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: [0, 0.1, 0.2, 1.2, 1],
                transition: { delay: 1.8, duration: 0.5 },
              }}
            ></m.div>
          </div>
        </div>
      </m.div>
    </section>
  );
}
