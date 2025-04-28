import { useState } from "react";

import SAMALogo from "@components/static/SAMALogo";

import PasswordInput from "@components/auth/elements/PasswordInput";
import UserNameInput from "@components/auth/elements/UserNameInput";
import ConfirmButton from "@components/auth/elements/ConfirmButton";

import HeaderWaves from "@icons/_helpers/HeaderWaves.svg?react";
import Discord from "@icons/socials/DiscordIcon.svg?react";
import Medium from "@icons/socials/MediumIcon.svg?react";
import GitHub from "@icons/socials/GitHubIcon.png";

export default function AuthorizationHub({ showDemoMessage = false }) {
  const [page, setPage] = useState("signup");
  const [content, setContent] = useState({});

  const isLoginPage = page === "login";

  return (
    <section className="w-dvw h-dvh max-sm:pt-[65px] flex flex-col justify-center items-center bg-[url(@assets/BGmax.svg)] bg-cover bg-no-repeat bg-center">
      <div
        className={`relative max-w-[95dvw] w-[1200px] max-lg:w-[min(600px,95dvw)] max-h-[95dvh] h-[800px] max-lg:h-max max-lg:py-[4dvh] p-[20px] flex flex-row justify-center gap-[20px] rounded-[32px] bg-(--color-bg-light) shadow-lg shadow-white-100/90`}
      >
        <HeaderWaves className="lg:hidden absolute w-full top-0 rounded-t-[32px]" />
        <div className=" w-1/2 max-lg:w-full self-center flex flex-col gap-[20px] justify-center px-[70px] max-xl:p-[18px] max-sm:p-[5px] z-10">
          <SAMALogo
            customClassName={
              "lg:hidden w-[190px] max-sm:w-[130px] bg-(--color-bg-light-90) p-[25px] max-sm:p-[20px] rounded-[60px] max-sm:rounded-full self-center -mt-[120px] shadow-md z-20"
            }
          />
          <div className="w-full">
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
          </div>
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
            <ConfirmButton page={page} content={content} />
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
              className="flex-1 flex flex-row gap-[10px] justify-center items-center py-[7px] px-[14px] border border-gray-700/30 rounded-lg cursor-pointer"
            >
              <img className="w-[28px] h-[28px]" src={GitHub} alt="" />
              <p className="!font-light">GitHub</p>
            </a>
            <a
              href="https://medium.com/sama-communications"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex flex-row gap-[10px] justify-center items-center py-[7px] px-[14px] border border-gray-700/30 rounded-lg cursor-pointer"
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
        </div>
        <div className="max-lg:hidden w-1/2 flex flex-col items-center justify-center bg-white rounded-[24px] py-[10px] px-[20px] bg-[url(@assets/BGmini.svg)] bg-cover bg-bottom">
          <div className="w-full flex flex-row justify-center items-center">
            <p className="text-h3 text-stone-900/60 !font-(family-name:--accent-font)">
              SAMA
            </p>
          </div>
          <div className="flex-1 pt-[50px]">
            <SAMALogo customClassName="w-[250px] bg-(--color-bg-light-50) p-[35px] rounded-[112px]" />
          </div>
          <div className="flex flex-col items-center justify-center gap-[30px]">
            <div className="text-center text-white text-h4">
              <p>Simple but Advanced</p>
              <p>Messaging Alternative</p>
            </div>
            <div className="w-[120px] h-[6px] mb-[15px] rounded-full bg-gray-300/50"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
