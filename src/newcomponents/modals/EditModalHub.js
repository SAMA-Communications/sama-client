import ChatInputs from "@newcomponents/modals/components/ChatInputs";
import PersonalInputs from "@newcomponents/modals/components/PersonalInputs";
import UserInputs from "@newcomponents/modals/components/UserInputs";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import usersService from "@services/usersService";
import { KEY_CODES } from "@helpers/keyCodes";
import { setCurrentUser } from "@store/values/CurrentUser";
import { upsertUser } from "@store/values/Participants";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";

import "@newstyles/modals/EditModalHub.css";

export default function EditModalHub() {
  const dispatch = useDispatch();
  const { pathname, hash, search } = useLocation();

  const [content, setContent] = useState({});
  const addFieldToEdit = (field, value) =>
    setContent((prev) => ({ ...prev, [field]: value }));

  const types = {
    chat: {
      component: <ChatInputs />,
      title: "Edit chat information",
    },
    personal: {
      component: <PersonalInputs setState={addFieldToEdit} />,
      title: "Edit personal info",
    },
    user: {
      component: <UserInputs setState={addFieldToEdit} />,
      title: "Edit your name",
    },
  };

  const type = (search || hash).split("=")[1];
  const { component, title } = types[type];

  const closeModal = () => removeAndNavigateLastSection(pathname + hash);

  const sendRequest = async () => {
    const newUserObject = await usersService.sendEditRequest(content, type);
    if (!newUserObject) {
      newUserObject !== false &&
        showCustomAlert("Update or fill in new data to save.", "warning");
      return;
    }

    dispatch(upsertUser(newUserObject));
    dispatch(setCurrentUser(newUserObject));
    showCustomAlert("User data has been successfully updated.", "success");
    closeModal();
  };

  window.onkeydown = function ({ keyCode }) {
    keyCode === KEY_CODES.ENTER && sendRequest();
  };

  return (
    <div className="edit-modal__container fcc">
      <div className="edit-modal__content--user">
        <p className="edit-modal__title">{title}</p>
        <div className="em-inputs__container">{component}</div>
        <div className="em-navigation__container fcc">
          <p className="em-navigation__link" onClick={closeModal}>
            Cancel
          </p>
          <p className="em-navigation__link" onClick={sendRequest}>
            Save
          </p>
        </div>
      </div>
    </div>
  );
}
