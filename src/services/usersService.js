import api from "@api/api";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { history } from "@helpers/history";

import validateEmail from "@validations/user/validateEmail";
import validateFieldLength from "@validations/validateFieldLength";
import validateIsEmptyObject from "@validations/validateIsEmtpyObject";
import validatePhone from "@validations/user/validatePhone";

class UsersService {
  constructor() {
    this.currentUser = store.getState().currentUser.value;
  }

  async login(data) {
    const { login, password } = data;

    if (!login || !password) {
      return;
    }

    const { token: userToken, user: userData } = await api.userLogin({
      login: login.trim().toLowerCase(),
      password: password.trim(),
    });
    localStorage.setItem("sessionId", userToken);
    api.curerntUserId = userData._id;

    return userData;
  }

  async create(data) {
    const { login, password } = data;

    if (!login || !password) {
      return;
    }

    return await api.userCreate({
      login: login.trim().toLowerCase(),
      password: password.trim(),
    });
  }

  async edit(data, typeOfValidation) {
    if (validateIsEmptyObject(data)) {
      return;
    }

    switch (typeOfValidation) {
      case "user":
        if (
          validateFieldLength(data.first_name, 1, 20, "first name") ||
          validateFieldLength(data.last_name, 1, 20, "last name")
        ) {
          return false;
        }
        break;
      case "personal":
        if (validateEmail(data.email) || validatePhone(data.phone)) {
          return false;
        }
        break;
      default:
        break;
    }

    try {
      return await api.userEdit(data);
    } catch (err) {
      showCustomAlert(err.message, "danger");
      return false;
    }
  }

  async search(data) {
    return await api.userSearch(data);
  }

  async changePassword(currentPassword, newPassword) {
    if (validateFieldLength(newPassword, 3, 40, "password")) {
      return;
    }

    try {
      await api.userEdit({
        current_password: currentPassword,
        new_password: newPassword,
      });
      showCustomAlert("Password has been successfully updated.", "success");
    } catch (err) {
      showCustomAlert(err.message, "danger");
    }
  }

  async deleteCurrentUser() {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.userDelete();
        history.navigate("/authorization");
        store.dispatch({ type: "RESET_STORE" });
      } catch (err) {
        showCustomAlert(err.message, "danger");
      }
    }
  }
}

const usersService = new UsersService();

export default usersService;
