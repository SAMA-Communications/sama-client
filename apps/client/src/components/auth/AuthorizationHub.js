import { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useAnimate } from "motion/react";
import * as m from "motion/react-m";

import AnimatedBGbig from "@components/auth/animations/AnimatedBGbig.js";
import AnimatedBGmini from "@components/auth/animations/AnimatedBGmini.js";
import ConfirmButton from "@components/auth/elements/ConfirmButton";
import EmailInput from "@components/auth/elements/EmailInput";
import PasswordInput from "@components/auth/elements/PasswordInput";
import SAMALogo from "@components/auth/elements/SAMALogo";
import UserNameInput from "@components/auth/elements/UserNameInput";

import HeaderWaves from "@icons/_helpers/HeaderWaves.svg?react";
import Discord from "@icons/socials/DiscordIcon.svg?react";
import GitHub from "@icons/socials/GitHubIcon.png";
import Medium from "@icons/socials/MediumIcon.svg?react";

import { ResetPasswordModal } from "@sama-communications.ui-kit";

import autoLoginService from "@services/autoLoginService.js";

import { getIsMobileView } from "@store/values/IsMobileView.js";

import { showCustomAlert } from "@utils/GeneralUtils.js";

export default function AuthorizationHub({ showDemoMessage = false }) {
  const [content, setContent] = useState({});
  const [page, setPage] = useState(localStorage.getItem("isUsedBefore") ? "login" : "signup");

  const [scope, animate] = useAnimate();
  const [triggerBGAnimation, setTriggerBGAnimation] = useState(false);

  const isMobileView = useSelector(getIsMobileView);

  const isLoginPage = page === "login";

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => setIsModalOpen(!!localStorage.getItem("reset_email")), []);
  useEffect(() => setTriggerBGAnimation(false));
  const triggerExitAnimation = () => {
    animate([[scope.current, { opacity: 0, scale: [1, 1.05, 0.6] }, { duration: 0.4 }]]);
    setTriggerBGAnimation(true);
  };

  return (
    <section className="flex h-full w-full flex-col items-center justify-center overflow-hidden">
      <AnimatedBGbig customClassName="absolute w-dvw h-dvh overflow-hidden z-0" isTriggered={triggerBGAnimation} />
      <m.div
        ref={scope}
        className={`shadow-white-100/90 bg-bg-light relative flex h-[800px] max-h-[94dvh] w-[1200px] max-w-[95dvw] flex-row justify-center gap-[20px] rounded-[32px] p-[20px] shadow-lg max-lg:h-max max-lg:w-[min(600px,94dvw)] max-lg:py-[4dvh]`}
        initial={{ scale: 0 }}
        animate={{
          scale: [0, 1.1, 1],
          transition: { delay: 0.1, duration: 0.9 },
        }}
      >
        <HeaderWaves className="absolute top-0 w-full rounded-t-[32px] lg:hidden" />
        <m.div
          className="z-10 flex w-1/2 flex-col justify-center gap-[20px] self-center px-[70px] max-xl:p-[18px] max-lg:w-full max-sm:p-[5px]"
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            scale: isMobileView ? [0, 1] : [0, 1.1, 1],
            transition: { delay: 0.3, duration: 0.9 },
          }}
        >
          <SAMALogo
            customClassName={
              "lg:hidden w-[190px] max-sm:w-[130px] bg-bg-light/90 p-[25px] max-sm:p-[20px] rounded-[60px] max-sm:rounded-full self-center -mt-[120px] max-sm:-mt-[90px] shadow-md z-20"
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
            <p className="text-[48px] font-medium max-md:text-[40px] max-sm:text-[33px]">
              {isLoginPage ? "Welcome back!" : "Create an account"}
            </p>
            <p className="text-[19px] font-extralight">
              {isLoginPage ? "Don`t have account?" : "Already have an account?"}
              &nbsp;
              <span
                className="text-accent-500 hover:text-accent-200 cursor-pointer font-normal transition-colors duration-200"
                onClick={() => setPage(isLoginPage ? "signup" : "login")}
              >
                {isLoginPage ? "Sign up" : "Log in"}
              </span>
            </p>
          </m.div>
          {showDemoMessage ? (
            <div className="bg-accent-500 rounded-lg px-[20px] py-[10px] text-center text-white">
              <p className="text-h6 font-light">Welcome to the SAMA demo.</p>
              <p className="mt-[10px]">
                You can connect using the following credentials:
                <br></br>
                <b>sama-user-1</b> or <b>sama-user-2</b> and <b>demo-password</b>
              </p>
            </div>
          ) : null}
          <div className="flex flex-1 flex-col gap-[15px] sm:mt-[25px]">
            <UserNameInput setState={setContent} isResetModalOpen={isModalOpen} />
            {isLoginPage ? null : <EmailInput setState={setContent} />}
            <PasswordInput setState={setContent} />
            {isLoginPage ? (
              <div className="flex gap-[7px]">
                <span onClick={() => setIsModalOpen(true)} className="text-accent-500 cursor-pointer font-normal">
                  Forgot password?
                </span>
              </div>
            ) : null}
            <ConfirmButton
              page={page}
              content={content}
              onClickEvent={triggerExitAnimation}
              isResetModalOpen={isModalOpen}
            />
          </div>
          <div className="flex w-full flex-row items-center gap-[10px]">
            <span className="h-px flex-1 rounded-[2px] bg-gray-700/30"></span>
            <p className="font-extralight text-gray-700/80">Our socials</p>
            <span className="h-px flex-1 rounded-[2px] bg-gray-700/30"></span>
          </div>
          <div className="grid flex-row gap-[15px] max-sm:grid-cols-2 sm:grid-cols-3">
            <a
              href="https://discord.gg/WSCQhFg65J"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 flex cursor-pointer flex-row items-center justify-center gap-[10px] rounded-lg border border-gray-700/30 px-[14px] py-[7px] transition-colors hover:bg-(--color-hover-light)"
            >
              <Discord className="h-[28px] w-[28px]" />
              <p className="font-light">Discord</p>
            </a>
            <a
              href="https://medium.com/sama-communications"
              target="_blank"
              rel="noopener noreferrer"
              className="col-span-1 flex cursor-pointer flex-row items-center justify-center gap-[10px] rounded-lg border border-gray-700/30 px-[14px] py-[7px] transition-colors hover:bg-(--color-hover-light)"
            >
              <Medium className="h-[28px] w-[28px]" />
              <p className="font-light">Medium</p>
            </a>
            <a
              href="https://github.com/SAMA-Communications"
              target="_blank"
              rel="noopener noreferrer"
              className="flex cursor-pointer flex-row items-center justify-center gap-[10px] rounded-lg border border-gray-700/30 px-[14px] py-[7px] transition-colors hover:bg-(--color-hover-light) max-sm:col-span-2 sm:col-span-1"
            >
              <img className="h-[28px] w-[28px]" src={GitHub} alt="" />
              <p className="font-light">GitHub</p>
            </a>
          </div>
        </m.div>
        <div className="relative flex w-1/2 flex-col items-center justify-center overflow-hidden rounded-[24px] px-[20px] py-[10px] max-lg:hidden">
          <AnimatedBGmini customClassName="absolute w-full h-full top-0 left-0 z-0" />
          <div className="z-10 flex w-full flex-row items-center justify-center">
            <m.p
              className="font-accent! text-[33px] text-stone-900/60"
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
          <div className="z-10 flex-1 pt-[50px]">
            <SAMALogo
              customClassName="w-[250px] bg-bg-light/50 p-[35px] rounded-[112px]"
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: 1,
                scale: [0, 1.2, 1],
                transition: { delay: 0.8, duration: 0.5 },
              }}
            />
          </div>
          <div className="z-10 flex flex-col items-center justify-center gap-[30px]">
            <m.div
              className="text-center text-[28px] font-extralight text-white"
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
              className="mb-[15px] h-[6px] w-[120px] rounded-full bg-gray-300/50"
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
      <ResetPasswordModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSendOTP={async (email) => {
          const success = await autoLoginService.sendOtpToken(email);
          return !!success;
        }}
        onResetPassword={async (data) => {
          const success = await autoLoginService.sendResetPassword(data.email, data.token, data.new_password);
          return !!success;
        }}
        onResendOTP={async (email) => {
          await autoLoginService.resendOtpToken(email);
        }}
        onValidationError={(msg) => showCustomAlert(msg, "warning")}
      />
    </section>
  );
}
