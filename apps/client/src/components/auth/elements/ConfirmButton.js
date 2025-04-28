import { useCallback, useState, useTransition } from "react";
import { useDispatch } from "react-redux";

import subscribeForNotifications from "@services/notifications";
import usersService from "@services/usersService";
import { useKeyDown } from "@hooks/useKeyDown";

import DotsLoader from "@components/_helpers/DotsLoader";

import { setCurrentUserId } from "@store/values/CurrentUserId";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";

import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@utils/global/keyCodes";

export default function ConfirmButton({ page, content }) {
  const dispatch = useDispatch();

  const [isPending, startTransition] = useTransition();
  const [isAutoAuth, setIsAutoAuth] = useState(true);

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
      }
    });
  }, [content, isAutoAuth, isLoginPage]);

  useKeyDown(KEY_CODES.ENTER, sendRequest);

  return (
    <>
      {isLoginPage ? null : (
        <label
          htmlFor="isAutoAuth"
          className="w-max text-gray-500 cursor-pointer select-none flex items-center"
        >
          <input
            className="mr-[5px]"
            type="checkbox"
            id="isAutoAuth"
            checked={isAutoAuth}
            onChange={() => setIsAutoAuth((prev) => !prev)}
          />
          * Sign in automatically after creating an account
        </label>
      )}
      <button
        className="w-full mt-[25px] py-[7px] px-[14px] flex justify-center bg-(--color-accent-dark) rounded-lg cursor-pointer"
        disabled={isPending}
        onClick={sendRequest}
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
      </button>
    </>
  );
}
