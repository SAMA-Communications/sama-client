import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useCallback, useState, useTransition } from "react";
import { useDispatch, useSelector } from "react-redux";

import subscribeForNotifications from "@services/tools/notifications";
import usersService from "@services/usersService";
import { useKeyDown } from "@hooks/useKeyDown";

import DotsLoader from "@components/_helpers/DotsLoader";

import { setCurrentUserId } from "@store/values/CurrentUserId";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView.js";

import { navigateTo } from "@utils/NavigationUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { KEY_CODES } from "@utils/global/keyCodes";

export default function ConfirmButton({ page, content, onClickEvent }) {
  const dispatch = useDispatch();

  const [isPending, startTransition] = useTransition();
  const [isAutoAuth, setIsAutoAuth] = useState(true);
  const isMobileView = useSelector(getIsMobileView);

  const isLoginPage = page === "login";

  const sendRequest = useCallback(() => {
    startTransition(async () => {
      let userData = null;
      try {
        if (isLoginPage) {
          userData = await usersService.login(content);
        } else {
          await usersService.create(content);
          if (isAutoAuth) {
            userData = await usersService.login(content);
          }
          showCustomAlert(
            `You’ve successfully created a new user${
              isAutoAuth ? " and logged in" : ". You can log in now"
            }.`,
            "success"
          );
        }
      } catch (err) {
        localStorage.removeItem("sessionId");
        showCustomAlert(err?.message || err, "danger");
      } finally {
        if (!userData) return;
        subscribeForNotifications();
        dispatch(setSelectedConversation({}));
        dispatch(setUserIsLoggedIn(true));
        dispatch(setCurrentUserId(userData._id));
        dispatch(upsertUser(userData));
        navigateTo("/");
        onClickEvent();
        localStorage.setItem("isUsedBefore", true);
      }
    });
  }, [content, isAutoAuth, isLoginPage]);

  useKeyDown(KEY_CODES.ENTER, sendRequest);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoginPage ? null : (
          <m.label
            key="isAutoAuthLabel"
            htmlFor="isAutoAuth"
            className="w-full text-gray-500 cursor-pointer select-none flex items-center max-md:items-start overflow-hidden max-sm:h-[42px] "
            animate={{ height: ["0px", isMobileView ? "42px" : "24px"] }}
            exit={{
              height: [isMobileView ? "42px" : "24px", "0px"],
              marginBottom: ["0px", "-15px"],
            }}
            transition={{ duration: 0.2 }}
          >
            <input
              className="mr-[5px] max-sm:mt-[5px]"
              type="checkbox"
              id="isAutoAuth"
              checked={isAutoAuth}
              onChange={() => setIsAutoAuth((prev) => !prev)}
            />
            * Sign in automatically after creating an account
          </m.label>
        )}
      </AnimatePresence>
      <AnimatePresence mode="wait">
        <m.button
          key={isLoginPage ? "login" : "signup"}
          className="w-full sm:mt-[25px] py-[7px] px-[14px] flex justify-center bg-(--color-accent-dark) hover:bg-(--color-accent-dark)/80 transition-colors  rounded-lg cursor-pointer"
          disabled={isPending}
          onClick={sendRequest}
          animate={{ opacity: [0.7, 1], scale: [1.02, 1] }}
          exit={{ opacity: [1, 0.7], scale: [1, 1.02] }}
          transition={{ duration: 0.2 }}
        >
          {isPending ? (
            <DotsLoader
              height={40}
              width={40}
              mainColor={"var(--color-accent-light)"}
            />
          ) : (
            <p className="h-[40px] flex-1 text-center flex items-center justify-center !font-normal text-white ">
              {isLoginPage ? "Log in" : "Create account"}
            </p>
          )}
        </m.button>
      </AnimatePresence>
    </>
  );
}
