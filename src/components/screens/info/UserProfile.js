import api from "../../../api/api";
import jwtDecode from "jwt-decode";
import showCustomAlert from "../../../utils/show_alert";
import { history } from "../../../_helpers/history";
import {
  selectParticipantsEntities,
  upsertUser,
} from "../../../store/Participants";
import { updateNetworkState } from "../../../store/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";

import "./../../../styles/pages/UserProfile.css";

import { ReactComponent as BackBtn } from "./../../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as ConfirmIcon } from "./../../../assets/icons/userProfile/ConfirmIcon.svg";
import { ReactComponent as EmailIcon } from "./../../../assets/icons/userProfile/EmailIcon.svg";
import { ReactComponent as PasswordIcon } from "./../../../assets/icons/userProfile/PasswordIcon.svg";
import { ReactComponent as PenEditIcon } from "./../../../assets/icons/userProfile/PenEditIcon.svg";
import { ReactComponent as PhoneIcon } from "./../../../assets/icons/userProfile/PhoneIcon.svg";
import { ReactComponent as TrashCan } from "./../../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as UserLoginIcon } from "./../../../assets/icons/userProfile/UserLoginIcon.svg";
import { ReactComponent as UndoChangeIcon } from "./../../../assets/icons/userProfile/UndoEditIcon.svg";

export default function UserProfile() {
  const dispatch = useDispatch();

  const participants = useSelector(selectParticipantsEntities);
  const userInfo = localStorage.getItem("sessionId")
    ? jwtDecode(localStorage.getItem("sessionId"))
    : null;

  // vv  User setting block  vv //
  const currentUser = useMemo(
    () => (userInfo ? participants[userInfo._id] : {}),
    [participants, userInfo]
  );

  const deleteCurrentUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await api.userDelete();
      history.navigate("/login");
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    }
  };

  window.onkeydown = function (event) {
    event.keyCode === 27 && history.navigate("/main");
    event.keyCode === 13 && event.preventDefault();
  };

  const userLetters = useMemo(() => {
    const { first_name, last_name, login } = currentUser;
    if (first_name) {
      return last_name
        ? first_name.slice(0, 1) + last_name.slice(0, 1)
        : first_name.slice(0, 1);
    }

    return login.slice(0, 2).toUpperCase();
  }, [currentUser]);
  // ʌʌ  User setting block  ʌʌ //

  // vv  Edit form block  vv //
  const [isDisableForm, setIsDisableForm] = useState(true);
  const formRef = useRef(null);
  const [newFirstName, setNewFirstName] = useState(null);
  const [newLastName, setNewLastName] = useState(null);
  const [newLogin, setNewLogin] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPhone, setNewPhone] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      return;
    }
    resetInputs();
  }, [currentUser]);

  const sendRequest = async () => {
    const { first_name, last_name, email, phone, login } = currentUser;
    const updatedParams = {};

    if (newLogin && newLogin !== login) {
      if (
        3 <= newLogin.length &&
        newLogin.length <= 40 &&
        !newLogin.includes(" ")
      ) {
        updatedParams["login"] = newLogin;
      } else {
        showCustomAlert(
          "The login field length must be in the range from 3 to 40.",
          "warning"
        );
        return;
      }
    } else if (!newLogin && login !== undefined) {
      showCustomAlert("The login field must not be empty.", "warning");
      return;
    }

    if (newEmail && newEmail !== email) {
      if (
        /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(newEmail) &&
        !newEmail.includes(" ")
      ) {
        updatedParams["email"] = newEmail;
      } else {
        showCustomAlert(
          "The format of the email address is incorrect.",
          "warning"
        );
        return;
      }
    } else if (!newEmail && email !== undefined) {
      showCustomAlert("The email address field cannot be empty.", "warning");
      return;
    }

    if (newPhone && newPhone !== phone) {
      if (
        newPhone.length >= 3 &&
        newPhone.length <= 15 &&
        !newPhone.includes(" ")
      ) {
        updatedParams["phone"] = newPhone;
      } else {
        showCustomAlert(
          "The phone number should be 3 to 15 digits in length.",
          "warning"
        );
        return;
      }
    } else if (!newPhone && phone !== undefined) {
      showCustomAlert("The phone number field must not be empty.", "warning");
      return;
    }

    if (newFirstName && newFirstName !== first_name) {
      if (newFirstName.length >= 1 && newFirstName.length <= 20) {
        updatedParams["first_name"] = newFirstName;
      } else {
        showCustomAlert(
          "The first name length must be in the range from 1 to 20.",
          "warning"
        );
        return;
      }
    } else if (!newFirstName && first_name !== undefined) {
      showCustomAlert("The first name field must not be empty.", "warning");
      return;
    }

    if (newLastName && newLastName !== last_name) {
      if (newLastName.length >= 1 && newLastName.length <= 20) {
        updatedParams["last_name"] = newLastName;
      } else {
        showCustomAlert(
          "The last name length must be in the range from 1 to 20.",
          "warning"
        );
        return;
      }
    } else if (!newLastName && last_name !== undefined) {
      showCustomAlert("The last name field must not be empty.", "warning");
      return;
    }

    if (!Object.keys(updatedParams).length) {
      setIsDisableForm(true);
      return;
    }
    if (!window.confirm("Will you confirm the data update?")) {
      return;
    }

    try {
      const userNewData = await api.userEdit(updatedParams);
      dispatch(upsertUser(userNewData));
      showCustomAlert("User data has been successfully updated.", "success");
      resetInputs();
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };

  const resetInputs = () => {
    formRef.current.reset();
    setIsDisableForm(true);
    const { first_name, last_name, email, phone, login } = currentUser;
    setNewFirstName(first_name);
    setNewLastName(last_name);
    setNewLogin(login);
    setNewEmail(email);
    setNewPhone(phone);
  };

  const changePasswordRequest = async () => {
    const currentPassword = window.prompt("Enter your current password:");
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
    } catch (error) {
      showCustomAlert(error.message, "danger");
    }
  };
  // ʌʌ  Edit form block  ʌʌ //

  return (
    <div className="user-options-bg">
      <div className="user-options-container">
        <div className="uo-navigation">
          <div className="uo-close" onClick={() => history.navigate("/main")}>
            <BackBtn />
          </div>
          <div className="uo-header">Edit profile</div>
          <div>
            <div className="uo-edit">
              {isDisableForm ? (
                <PenEditIcon onClick={() => setIsDisableForm(false)} />
              ) : (
                <>
                  <UndoChangeIcon className="uo-reset" onClick={resetInputs} />
                  <ConfirmIcon onClick={sendRequest} />
                </>
              )}
            </div>
            <div className="uo-delete" onClick={deleteCurrentUser}>
              <TrashCan />
            </div>
          </div>
        </div>
        <form id="updateForm" onSubmit={sendRequest} ref={formRef}>
          <div className="uo-photo-name">
            <div className="uo-photo">{userLetters}</div>
            <p className="uo-name">
              <input
                id="uoNameFirstName"
                onChange={(e) => {
                  const newFirstName = e.target.value?.trim();
                  setNewFirstName(!newFirstName.length ? null : newFirstName);
                }}
                defaultValue={currentUser.first_name}
                placeholder="First name"
                disabled={isDisableForm}
              />
              <input
                id="uoNameLastName"
                onChange={(e) => {
                  const newLastName = e.target.value?.trim();
                  setNewLastName(!newLastName.length ? null : newLastName);
                }}
                defaultValue={currentUser.last_name}
                placeholder="Last name"
                disabled={isDisableForm}
              />
            </p>
          </div>
          <div className="uo-info">
            <div>
              <UserLoginIcon />
              <p className="uo-login">
                Username:
                <input
                  onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  onChange={(e) => {
                    const newLogin = e.target.value?.trim();
                    setNewLogin(!newLogin.length ? null : newLogin);
                  }}
                  defaultValue={currentUser.login}
                  placeholder="username"
                  disabled={true} //isDisableForm
                />
              </p>
            </div>
            <div>
              <EmailIcon />
              <p className="uo-email">
                Email address:
                <input
                  onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  onChange={(e) => {
                    const newEmail = e.target.value?.trim();
                    setNewEmail(!newEmail.length ? null : newEmail);
                  }}
                  defaultValue={currentUser.email}
                  placeholder="email address"
                  disabled={isDisableForm}
                />
              </p>
            </div>
            <div>
              <PhoneIcon />
              <p className="uo-phone">
                Phone number:
                <input
                  onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  onChange={(e) => {
                    const newPhone = e.target.value?.trim();
                    setNewPhone(!newPhone.length ? null : newPhone);
                  }}
                  defaultValue={currentUser.phone}
                  placeholder="phone number"
                  disabled={isDisableForm}
                />
              </p>
            </div>
            <div>
              <PasswordIcon />
              <p className="uo-password">
                Password :
                <span onClick={changePasswordRequest}>change password...</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
