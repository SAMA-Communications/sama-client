import { useState } from "react";

import SAMAbigLogo from "@components/static/SAMAbigLogo";

import PasswordInput from "@components/auth/elements/PasswordInput";
import UserNameInput from "@components/auth/elements/UserNameInput";
import ConfirmButton from "@components/auth/elements/ConfirmButton";

import Medium from "@icons/socials/MediumIcon.svg?react";
import GitHub from "@icons/socials/GitHubIcon.png";

export default function AuthorizationHub({ showDemoMessage = false }) {
  const [page, setPage] = useState("signup");
  const [content, setContent] = useState({});

  const isLoginPage = page === "login";

  return (
    <section className="w-dvw h-dvh flex flex-col justify-center items-center">
      <div
        className={`max-w-[95dvw] w-[1200px] max-h-[95dvh] h-[800px] p-[20px] flex flex-row gap-[20px] rounded-[32px] bg-(--color-bg-light)`}
      >
        <div className="w-1/2 self-center flex flex-col gap-[20px] px-[70px] justify-center">
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
          <div className="w-full">
            <p className="text-h1 !font-medium">
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
          <div className="mt-[25px] flex-1 flex flex-col gap-[15px]">
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
          </div>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center bg-white rounded-[24px] py-[10px] px-[20px] bg-[url(@assets/BGmini.png)] bg-[length:100%_100%]">
          <div className="w-full flex flex-row justify-center items-center">
            <p className="text-h3 text-stone-900/60 !font-(family-name:--accent-font)">
              SAMA
            </p>
          </div>
          <div className="flex-1 pt-[50px]">
            <SAMAbigLogo />
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
