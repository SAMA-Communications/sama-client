import api from "../../api/api";
import jwtDecode from "jwt-decode";
import showCustomAlert from "../../utils/show_alert";
import { history } from "../../_helpers/history";
import {
  selectParticipantsEntities,
  upsertUser,
} from "../../store/Participants";
import { updateNetworkState } from "../../store/NetworkState";
import { useDispatch, useSelector } from "react-redux";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "./../../styles/pages/UserProfile.css";

import { ReactComponent as BackBtn } from "./../../assets/icons/chatForm/BackBtn.svg";
import { ReactComponent as ConfirmIcon } from "./../../assets/icons/userProfile/ConfirmIcon.svg";
import { ReactComponent as EmailIcon } from "./../../assets/icons/userProfile/EmailIcon.svg";
import { ReactComponent as PasswordIcon } from "./../../assets/icons/userProfile/PasswordIcon.svg";
import { ReactComponent as PenEditIcon } from "./../../assets/icons/userProfile/PenEditIcon.svg";
import { ReactComponent as PhoneIcon } from "./../../assets/icons/userProfile/PhoneIcon.svg";
import { ReactComponent as TrashCan } from "./../../assets/icons/chatForm/TrashCan.svg";
import { ReactComponent as UserLoginIcon } from "./../../assets/icons/userProfile/UserLoginIcon.svg";
import { ReactComponent as UndoChangeIcon } from "./../../assets/icons/userProfile/UndoEditIcon.svg";

export default function UserProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    if (window.confirm("Do you confirm the user's deletion?")) {
      await api.userDelete();
      navigate("/login");
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
  const [newFullName, setNewFullName] = useState(null);
  const [newLogin, setNewLogin] = useState(null);
  const [newEmail, setNewEmail] = useState(null);
  const [newPhone, setNewPhone] = useState(null);

  const sendRequest = async () => {
    const { first_name, last_name, email, phone, login } = currentUser;
    const updatedParams = {};

    if (newLogin && newLogin !== login) {
      if (3 <= newLogin.length && newLogin.length <= 40) {
        updatedParams["login"] = newLogin;
      } else {
        showCustomAlert(
          "The login field must be in the range from 3 to 40.",
          "warning"
        );
        return;
      }
    } else if (newLogin !== null) {
      showCustomAlert("The login field must not be empty.", "warning");
      return;
    }

    if (newEmail && newEmail !== email) {
      if (/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(newEmail)) {
        updatedParams["email"] = newEmail;
      } else {
        showCustomAlert("Incorrect email address format.", "warning");
        return;
      }
    } else if (newEmail !== null) {
      showCustomAlert("The email address field must not be empty.", "warning");
      return;
    }

    if (newPhone && newPhone !== phone) {
      if (newPhone.length >= 3 && newPhone.length <= 15) {
        updatedParams["phone"] = newPhone;
      } else {
        showCustomAlert(
          "The phone number must be between 3 and 15 characters long.",
          "warning"
        );
        return;
      }
    } else if (newPhone !== null) {
      showCustomAlert("The phone number field must not be empty.", "warning");
      return;
    }

    let currentFullName;
    if (first_name && last_name) {
      currentFullName = first_name + " " + last_name;
    } else if (first_name || last_name) {
      currentFullName = first_name ? first_name : last_name;
    } else {
      currentFullName = null;
    }
    if (newFullName && currentFullName !== newFullName) {
      const [new_first_name, new_last_name] = newFullName.split(" ");
      if (new_first_name !== first_name) {
        if (new_first_name.length > 20) {
          showCustomAlert(
            "The first name must be in the range from 1 to 10.",
            "warning"
          );
          return;
        }
        updatedParams["first_name"] = new_first_name;
      }
      if (new_last_name && new_last_name !== last_name) {
        if (new_last_name.length > 20) {
          showCustomAlert(
            "The last name must be in the range from 1 to 10.",
            "warning"
          );
          return;
        }
        updatedParams["last_name"] = new_last_name;
      }
    } else if (newFullName !== null) {
      showCustomAlert("The name field must not be empty.", "warning");
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
    setNewFullName(null);
    setNewLogin(null);
    setNewEmail(null);
    setNewPhone(null);
  };
  // ʌʌ  Edit form block  ʌʌ //

  return (
    <div className="user-options-bg">
      <div className="user-options-container">
        <div className="uo-navigation">
          <div className="uo-close" onClick={() => history.navigate("/main")}>
            <BackBtn />
          </div>
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
                onKeyDown={(e) => {
                  const { target, key } = e;
                  if (target.value?.includes(" ") && key === " ") {
                    return e.preventDefault();
                  }
                }}
                onChange={(e) => setNewFullName(e.target.value?.trim())}
                onReset={(e) => console.log(e)}
                defaultValue={
                  currentUser.last_name
                    ? currentUser.first_name + " " + currentUser.last_name
                    : currentUser.last_name
                }
                placeholder="Full name"
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
                  onChange={(e) => setNewLogin(e.target.value?.trim())}
                  defaultValue={currentUser.login}
                  placeholder="username"
                  disabled={isDisableForm}
                />
              </p>
            </div>
            <div>
              <EmailIcon />
              <p className="uo-email">
                Email address:
                <input
                  onKeyDown={(e) => e.key === " " && e.preventDefault()}
                  onChange={(e) => setNewEmail(e.target.value?.trim())}
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
                  onChange={(e) => setNewPhone(e.target.value?.trim())}
                  defaultValue={currentUser.phone}
                  placeholder="phone number"
                  disabled={isDisableForm}
                />
              </p>
            </div>
            <div>
              <PasswordIcon />
              <p className="uo-password">
                Password :<span onClick={() => {}}>change password...</span>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
