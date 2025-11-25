import api from "@api/api";

import { default as EventEmitter } from "@lib/eventEmitter";

import subscribeForNotifications from "@services/tools/notifications";

import store from "@store/store";
import { setCurrentUserId } from "@store/values/CurrentUserId";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";

import { navigateTo } from "@utils/NavigationUtils.js";
import { showCustomAlert } from "@utils/GeneralUtils.js";
import { history } from "@utils/history.js";

class AutoLoginService {
  constructor() {
    EventEmitter.subscribe("onConnect", () => {
      const token = localStorage.getItem("sessionId");
      if (!token || token === "undefined") {
        return;
      }
      this.userLoginByToken(token);
    });
  }

  async useAccessToken() {
    const accessToken = localStorage.getItem("sessionId");

    const responseData = await api.connectSocket({ token: accessToken });
    if (responseData.error) return api.userLogin();

    const user = JSON.parse(localStorage.getItem("userData") || null);
    return { user };
  }

  async userLoginByToken() {
    const currentTime = Date.now();
    const tokenExpiredAt =
      localStorage.getItem("sessionExpiredAt") || currentTime;

    const currentPath = history.location?.hash;
    const handleLoginFailure = () => {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionExpiredAt");
      localStorage.removeItem("userData");
      navigateTo("/authorization");
      store.dispatch(setUserIsLoggedIn(false));
    };

    try {
      const {
        access_token: userToken,
        expired_at: accessTokenExpiredAt,
        user: userData,
        message: errorMessage,
      } = await (tokenExpiredAt - currentTime > 500
        ? this.useAccessToken()
        : api.userLogin());

      if (errorMessage) {
        console.log(errorMessage);

        throw new Error(
          errorMessage === "Missing authentication credentials."
            ? "Your session has ended. Please log in again to continue."
            : errorMessage
        );
      }

      if ((!userToken || userToken === "undefined") && !userData) {
        throw new Error("Invalid session token.");
      }

      if (userToken && userToken !== "undefined") {
        await api.connectSocket({ token: userToken });
        localStorage.setItem("sessionId", userToken);
        localStorage.setItem("sessionExpiredAt", accessTokenExpiredAt);
      }

      if (userData) {
        localStorage.setItem("userData", JSON.stringify(userData));
        store.dispatch(setCurrentUserId(userData._id));
        api.curerntUserId = userData._id;

        subscribeForNotifications();
        store.dispatch(upsertUser(userData));
      }

      store.dispatch(setUserIsLoggedIn(true));

      const { pathname, hash } = history.location;
      const path = hash ? pathname + hash : "/";
      setTimeout(() => {
        navigateTo(
          path.includes("/attach")
            ? path.replace("/attach", "")
            : path.includes("/media")
            ? path.replace(/\/media.*/, "")
            : path
        );
        currentPath &&
          store.dispatch(
            setSelectedConversation({
              id: currentPath.split("/")[0].slice(1),
            })
          );
      }, 20);
    } catch (error) {
      handleLoginFailure();
      showCustomAlert(error.message, "warning");
    }
  }

  async sendOtpToken(email) {
    try {
      await api.userSendOTPToken({ email });
      localStorage.setItem("reset_email", email);
    } catch (err) {
      showCustomAlert(
        err.message || "We couldn’t find an account with this email.",
        "warning"
      );
      return false;
    }
    return true;
  }

  async resendOtpToken(email) {
    try {
      await api.userSendOTPToken({ email });
      showCustomAlert("OTP sent.", "success");
    } catch (err) {
      showCustomAlert(
        err.message || "Failed to resend token. Try again.",
        "warning"
      );
      return false;
    }
    return true;
  }

  async sendResetPassword(email, token, newPassword) {
    try {
      await api.userResetPassword({
        email,
        token: +token,
        new_password: newPassword,
      });
      localStorage.removeItem("reset_email");
      showCustomAlert("Password successfully changed.", "success");
    } catch (err) {
      showCustomAlert(
        err.message || "Failed to reset password. Try again.",
        "warning"
      );
      return false;
    }
    return true;
  }
}

const autoLoginService = new AutoLoginService();

export default autoLoginService;
