import api from "@api/api";
import store from "@store/store";
import { history } from "@helpers/history";

class UsersService {
  async deleteCurrentUser() {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.userDelete();
      history.navigate("/login");
      store.dispatch({ type: "RESET_STORE" });
    }
  }
}

const usersService = new UsersService();

export default usersService;
