import api from "@api/api";
import showCustomAlert from "@utils/show_alert";
import store from "@store/store";
import { history } from "@helpers/history";

class UsersService {
  currentUser = store.getState().currentUser.value;

  #showWarningAlert(message) {
    showCustomAlert(message, "warning");
    return true;
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

  #validateFirstAndLastNameFields(obj) {
    const { first_name: newFirstName, last_name: newLastName } = obj;
    const { first_name: oldFirstName, last_name: oldLastName } =
      this.currentUser;

    if (newFirstName !== oldFirstName) {
      if (newFirstName?.length < 1 || newFirstName?.length > 20) {
        return this.#showWarningAlert(
          "The first name length must be in the range from 1 to 20."
        );
      }
    } else if (!newFirstName && oldFirstName !== undefined) {
      return this.#showWarningAlert("The first name field must not be empty.");
    }

    if (newLastName !== oldLastName) {
      if (newLastName?.length < 1 || newLastName?.length > 20) {
        return this.#showWarningAlert(
          "The last name length must be in the range from 1 to 20."
        );
      }
    } else if (!newLastName && oldLastName !== undefined) {
      return this.#showWarningAlert("The last name field must not be empty.");
    }

    return false;
  }

  #validateMobileAndEmailFields(obj) {
    const { email: newEmail, phone: newPhone } = obj;
    const { email: oldEmail, phone: oldPhone } = this.currentUser;

    if (newEmail !== oldEmail) {
      if (
        newEmail &&
        !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(newEmail)
      ) {
        return this.#showWarningAlert(
          "The format of the email address is incorrect."
        );
      }
    } else if (!newEmail && oldEmail !== undefined) {
      return this.#showWarningAlert("The email address field cannot be empty.");
    }

    if (newPhone !== oldPhone) {
      if (newPhone && !/^[0-9]{3,15}$/.test(newPhone)) {
        return this.#showWarningAlert(
          "The phone number should be 3 to 15 digits in length."
        );
      }
    } else if (!newPhone && oldPhone !== undefined) {
      return this.#showWarningAlert(
        "The phone number field must not be empty."
      );
    }

    return false;
  }

  async sendEditRequest(data, typeOfValidation) {
    console.log(data);
    if (this.#validateIsEmptyObject(data)) {
      return;
    }

    if (
      typeOfValidation === "user" &&
      this.#validateFirstAndLastNameFields(data)
    ) {
      return false;
    }

    if (
      typeOfValidation === "personal" &&
      this.#validateMobileAndEmailFields(data)
    ) {
      return false;
    }

    return await api.userEdit(data);
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
    while (newPassword?.length < 3 || newPassword?.length > 40) {
      alert("Password length must be in the range of 3 to 40.");
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
      await api.userDelete();
      history.navigate("/login");
      store.dispatch({ type: "RESET_STORE" });
    }
  }
}

const usersService = new UsersService();

export default usersService;
