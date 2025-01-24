import DownloadManager from "@src/adapters/downloadManager";
import api from "@api/api";
import isHeic from "@utils/media/is_heic";
import processFile from "@utils/media/process_file";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { upsertUser } from "@store/values/Participants";

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

    const {
      access_token: userToken,
      expired_at: accessTokenExpiredAt,
      user: userData,
      message: errorMessage,
    } = await api.userLogin({
      login: login.trim().toLowerCase(),
      password: password.trim(),
    });

    if (errorMessage) throw new Error(errorMessage);

    if (userToken) await api.connectSocket({ token: userToken });
    localStorage.setItem("sessionId", userToken);
    localStorage.setItem("sessionExpiredAt", accessTokenExpiredAt);

    delete userData.password_salt;
    delete userData.encrypted_password;
    localStorage.setItem("userData", JSON.stringify(userData));

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
    const performLogoutRequest = async () => {
      const response = await api.userLogout();

      if (!response.success) {
        await api.disconnectSocket();
      }
    };

    try {
      const reg = await Promise.race([
        navigator.serviceWorker.ready,
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error("Service Worker ready timed out")),
            500
          )
        ),
      ]);
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await sub.unsubscribe();
        await api.pushSubscriptionDelete();
      }
      await performLogoutRequest();
    } catch (err) {
      console.error(err);
      await performLogoutRequest();
      throw new Error("User logout error");
    } finally {
      localStorage.removeItem("sessionId");
      localStorage.removeItem("sessionExpiredAt");
      localStorage.removeItem("userData");
    }
  }

  async updateUserAvatar(file) {
    if (!file) {
      return;
    }

    const currentUserId = store.getState().currentUserId.value.id;
    store.dispatch(
      upsertUser({
        _id: currentUserId,
        avatar_url: isHeic(file.name) ? null : URL.createObjectURL(file),
      })
    );

    const avatarFile = await processFile(file, 0.2, 300);
    if (!avatarFile) {
      store.dispatch(upsertUser({ _id: currentUserId, avatar_url: undefined }));
      showCustomAlert("An error occured while processing the file.", "warning");
      return;
    }

    const avatarObject = (
      await DownloadManager.getFileObjects([avatarFile])
    ).at(0);
    const requestData = {
      avatar_object: {
        file_id: avatarObject.file_id,
        file_name: avatarObject.file_name,
        file_blur_hash: avatarFile.blurHash,
      },
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
