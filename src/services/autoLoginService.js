import api from "../api/api";
import showCustomAlert from "../utils/show_alert";
import store from "../store/store";
import subscribeForNotifications from "./notifications";
import { default as EventEmitter } from "../event/eventEmitter";
import { history } from "../_helpers/history";
import { setSelectedConversation } from "../store/SelectedConversation";
import { setUserIsLoggedIn } from "../store/UserIsLoggedIn ";
import { upsertUser } from "../store/Participants";

class AutoLoginService {
  constructor() {
    EventEmitter.subscribe("onConnect", () => {
      const token = localStorage.getItem("sessionId");
      if (!token || token === "undefined") {
        return;
      }
      this.userLogin(token);
    });
  }

  async userLogin(token) {
    const currentPath = history.location.hash;

    const handleLoginFailure = () => {
      localStorage.removeItem("sessionId");
      history.navigate("/login");
      store.dispatch(setUserIsLoggedIn(false));
    };

    try {
      const { token: userToken, user: userData } = await api.userLogin({
        token,
      });

      if (userToken && userToken !== "undefined") {
        localStorage.setItem("sessionId", userToken);
        subscribeForNotifications();
        store.dispatch(upsertUser(userData));

        currentPath &&
          store.dispatch(setSelectedConversation({ id: currentPath.slice(1) }));
        store.dispatch(setUserIsLoggedIn(true));

        const token = localStorage.getItem("sessionId");
        if (token && token !== "undefined") {
          const { pathname, hash } = history.location;
          const path = hash ? pathname + hash : "/main";
          setTimeout(() => {
            history.navigate(path);
          }, 50);
        } else {
          localStorage.removeItem("sessionId");
          history.navigate("/login");
        }
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
