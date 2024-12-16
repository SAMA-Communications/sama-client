import api from "@api/api";
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

  async userRefreshToken() {
    const responseData = await api.userLogin();
    if (responseData.access_token) {
      await api.connectSocket({ token: responseData.access_token });
    }
    return responseData;
  }

  async userLoginByToken() {
    const currentTime = Date.now();
    const tokenExpiredAt =
      localStorage.getItem("sessionExpiredAt") || currentTime;

    const currentPath = history.location?.hash;
    const handleLoginFailure = () => {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionExpiredAt");
      navigateTo("/authorization");
      store.dispatch(setUserIsLoggedIn(false));
    };

    try {
      const {
        access_token: userToken,
        expired_at: accessTokenExpiredAt,
        user: userData,
      } = await (tokenExpiredAt - currentTime < 30000
        ? this.userRefreshToken()
        : api.userLogin());

      await api.connectSocket({ token: userToken });

      if (userToken && userToken !== "undefined") {
        localStorage.setItem("sessionId", userToken);
        localStorage.setItem("sessionExpiredAt", accessTokenExpiredAt);

        store.dispatch(setCurrentUserId(userData._id));
        api.curerntUserId = userData._id;

        subscribeForNotifications();
        store.dispatch(upsertUser(userData));

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
      } else {
        handleLoginFailure();
        showCustomAlert("Invalid session token.", "warning");
      }
    } catch (error) {
      handleLoginFailure();
      showCustomAlert(error.message, "warning");
    }
  }
}

const autoLoginService = new AutoLoginService();

export default autoLoginService;
