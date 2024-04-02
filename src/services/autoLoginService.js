import api from "@api/api";
import navigateTo from "@utils/navigation/navigate_to";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import subscribeForNotifications from "@services/notifications";
import { default as EventEmitter } from "@event/eventEmitter";
import { history } from "@helpers/history";
import { setCurrentUser } from "@store/values/CurrentUser";
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
      this.userLogin(token);
    });
  }

  async userLogin(token) {
    const currentPath = history.location?.hash;
    const handleLoginFailure = () => {
      localStorage.removeItem("sessionId");
      navigateTo("/authorization");
      store.dispatch(setUserIsLoggedIn(false));
    };

    try {
      const { token: userToken, user: userData } = await api.userLogin({
        token,
      });

      if (userToken && userToken !== "undefined") {
        localStorage.setItem("sessionId", userToken);
        store.dispatch(setCurrentUser(userData));
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
