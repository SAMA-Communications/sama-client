import api from "@api/api";
import encryptionService from "./encryptionService";
import garbageCleaningService from "./garbageCleaningService";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import subscribeForNotifications from "@services/notifications";
import { default as EventEmitter } from "@event/eventEmitter";
import { history } from "@helpers/history";
import { setCurrentUserId } from "@store/values/CurrentUserId";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";

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
      garbageCleaningService.handleLoginFailure();
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

        await encryptionService.registerDevice(userData._id);

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
}

const autoLoginService = new AutoLoginService();

export default autoLoginService;
