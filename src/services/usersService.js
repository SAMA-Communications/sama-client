import DownloadManager from "@src/adapters/downloadManager";
import api from "@api/api";
import processFile from "@utils/media/process_file";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { upsertUser, upsertUsers } from "@src/store/values/Participants";

import validateEmail from "@validations/user/validateEmail";
import validateFieldLength from "@validations/validateFieldLength";
import validateIsEmptyObject from "@validations/validateIsEmtpyObject";
import validateLogin from "@validations/user/validateLogin";
import validatePassword from "@validations/user/validatePassword";
import validatePhone from "@validations/user/validatePhone";

class UsersService {
  async login(data) {
    const { login, password } = data;

    if (!login?.length || !password?.length) {
      throw new Error("Username and Password cannot be blank.");
    }

    if (!validateLogin(login)) {
      throw new Error(
        "The username field must contain from 3 to 20 characters."
      );
    }

    if (!validatePassword(password)) {
      throw new Error(
        "The password field must contain from 3 to 20 characters"
      );
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

    if (!login?.length || !password?.length) {
      throw new Error("Username and Password cannot be blank.");
    }

    if (!validateLogin(login)) {
      throw new Error(
        "The username field must contain from 3 to 20 characters."
      );
    }

    if (!validatePassword(password)) {
      throw new Error(
        "The password field must contain from 3 to 20 characters"
      );
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

  async logout() {
    navigator.serviceWorker.ready
      .then((reg) =>
        reg.pushManager.getSubscription().then((sub) =>
          sub.unsubscribe().then(async () => {
            await api.pushSubscriptionDelete();
            await api.userLogout();
            localStorage.removeItem("sessionId");
          })
        )
      )
      .catch(async (err) => {
        console.error(err);
        await api.userLogout();
        localStorage.removeItem("sessionId");
        throw new Error("User logout error");
      });
  }

  async updateUserAvatar(file) {
    if (!file) {
      return;
    }

    const currentUser = store.getState().currentUser.value;
    store.dispatch(
      upsertUser({
        _id: currentUser._id,
        avatar_url: URL.createObjectURL(file),
      })
    );

    const avatarFile = await processFile(file);
    const requestData = { login: currentUser.login };

    if (!avatarFile) {
      store.dispatch(
        upsertUser({ _id: currentUser._id, avatar_url: undefined })
      );
      showCustomAlert("An error occured while processing the file.", "warning");
      return;
    }

    const avatarObject = (
      await DownloadManager.getFileObjects([avatarFile])
    ).at(0);
    requestData["avatar_object"] = {
      file_id: avatarObject.file_id,
      file_name: avatarObject.file_name,
      file_blur_hash: avatarFile.blurHash,
    };

    try {
      const userObject = await api.userEdit(requestData);
      userObject["avatar_url"] = avatarObject.file_url;
      store.dispatch(upsertUser(userObject));
    } catch (err) {
      showCustomAlert("The server connection is unavailable.", "warning");
      return;
    }
  }

  async uploadAvatarsUrls(objects) {
    const downloadedFiles = await DownloadManager.getDownloadFileLinks(objects);
    const updatedUsers = [];

    downloadedFiles.forEach(({ attachments, _id: userId }) => {
      const file = attachments[0];
      updatedUsers.push({ _id: userId, avatar_url: file.file_url });
    });
    // console.log(updatedUsers);
    store.dispatch(upsertUsers(updatedUsers));
  }

  async deleteCurrentUser() {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.userDelete();
        store.dispatch({ type: "RESET_STORE" });
        return true;
      } catch (err) {
        showCustomAlert(err.message, "danger");
        return false;
      }
    } else {
      return false;
    }
  }
}

const usersService = new UsersService();

export default usersService;
