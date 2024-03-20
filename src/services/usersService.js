import api from "@api/api";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { history } from "@helpers/history";

class UsersService {
  constructor() {
    this.currentUser = store.getState().currentUser.value;
  }

  #showWarningAlert(message) {
    showCustomAlert(message, "warning");
    return true;
  }

  #validateFieldLength(value, min, max, fieldName) {
    const length = value?.trim().length;
    if (length < min || length > max) {
      this.#showWarningAlert(
        `The ${fieldName} length must be in the range from ${min} to ${max}.`
      );
      return true;
    }
    return false;
  }

  #validateEmail(email) {
    if (email && !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(email)) {
      this.#showWarningAlert("The format of the email address is incorrect.");
      return true;
    }
    return false;
  }

  #validatePhone(phone) {
    if (phone && !/^[0-9]{3,15}$/.test(phone)) {
      this.#showWarningAlert(
        "The phone number should be 3 to 15 digits in length."
      );
      return true;
    }
    return false;
  }

  #validateIsEmptyObject(obj) {
    const keys = Object.keys(obj);
    if (!keys.length) {
      return true;
    }

    let isValueEmpty = true;
    keys.forEach((key) => !!obj[key]?.trim() && (isValueEmpty = false));

    return isValueEmpty;
  }

  async sendEditRequest(data, typeOfValidation) {
    if (this.#validateIsEmptyObject(data)) {
      return;
    }

    switch (typeOfValidation) {
      case "user":
        if (
          this.#validateFieldLength(data.first_name, 1, 20, "first name") ||
          this.#validateFieldLength(data.last_name, 1, 20, "last name")
        ) {
          return false;
        }
        break;
      case "personal":
        if (
          this.#validateEmail(data.email) ||
          this.#validatePhone(data.phone)
        ) {
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

  async sendSearchRequest(data) {
    return await api.userSearch(data);
  }

  async changePasswordRequest() {
    const currentPassword = window.prompt("Enter your current password:");
    if (!currentPassword) {
      return;
    }

    let newPassword = window.prompt("Enter a new password:");
    while (this.#validateFieldLength(newPassword, 3, 40, "password")) {
      newPassword = window.prompt("Enter a new password:");
    }

    if (!newPassword || !currentPassword) {
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
        history.navigate("/login");
        store.dispatch({ type: "RESET_STORE" });
      } catch (err) {
        showCustomAlert(err.message, "danger");
      }
    }
  }
}

const usersService = new UsersService();

export default usersService;
