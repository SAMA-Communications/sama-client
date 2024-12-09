import api from "@api/api";
import buildHttpUrl from "@utils/navigation/build_http_url";
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

  async #sendLoginRequest(endpoint, data) {
    console.log("[http.request]", { request: data });

    const response = await fetch(`${buildHttpUrl()}/${endpoint}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();
    console.log("[http.response]", { response: responseData });

    if (responseData.access_token) {
      await api.connectSocket({ token: responseData.access_token });
    }

    return responseData;
  }

  async userLoginWithHttp(data) {
    const { login, password, accessToken } = data;

    const requestData = { device_id: api.deviceId };
    if (login && password) {
      requestData.login = login;
      requestData.password = password;
    } else if (accessToken) {
      requestData.access_token = accessToken;
    }

    return await this.#sendLoginRequest("login", requestData);
  }

  async userRefreshToken() {
    const requestData = { device_id: api.deviceId };
    return await this.#sendLoginRequest("login", requestData);
  }

  async userLoginByToken() {
    const token = localStorage.getItem("sessionId");
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
        : this.userLoginWithHttp({ accessToken: token }));

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
