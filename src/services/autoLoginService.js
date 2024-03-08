import api from "@api/api";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import subscribeForNotifications from "@services/notifications";
import { default as EventEmitter } from "@event/eventEmitter";
import { history } from "@helpers/history";
import { setSelectedConversation } from "@store/values/SelectedConversation";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { upsertUser } from "@store/values/Participants";
import { setCurrentUser } from "@store/values/CurrentUser";

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
      history.navigate("/login"); //authorization
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
          history.navigate(path);
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
