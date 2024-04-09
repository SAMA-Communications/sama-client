import GroupDetailsInputs from "@components/modals/components/GroupDetailsInputs";
import UserContactsInput from "@components/modals/components/UserContactsInput";
import UserNameInputs from "@components/modals/components/UserNameInputs";
import conversationService from "@services/conversationsService";
import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import usersService from "@services/usersService";
import { KEY_CODES } from "@helpers/keyCodes";
import { setCurrentUser } from "@store/values/CurrentUser";
import { upsertChat } from "@store/values/Conversations";
import { upsertUser } from "@store/values/Participants";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useKeyDown } from "@hooks/useKeyDown";
import { useLocation } from "react-router-dom";

import "@styles/modals/EditModalHub.css";

export default function EditModalHub() {
  const dispatch = useDispatch();
  const { pathname, hash, search } = useLocation();

  const [content, setContent] = useState({});

  const addFieldToEdit = (field, value) =>
    setContent((prev) => ({ ...prev, [field]: value }));

  const types = {
    chat: {
      component: <GroupDetailsInputs setState={addFieldToEdit} />,
      title: "Edit chat information",
      styleName: "chatname",
    },
    personal: {
      component: <UserContactsInput setState={addFieldToEdit} />,
      title: "Edit personal info",
      styleName: "user",
    },
    user: {
      component: <UserNameInputs setState={addFieldToEdit} />,
      title: "Edit your name",
      styleName: "user",
    },
  };

  const type = (search || hash).split("=")[1];
  const { component, title, styleName } = types[type];

  const closeModal = useCallback(
    () => removeAndNavigateLastSection(pathname + hash),
    [pathname, hash]
  );

  const sendRequest = useCallback(async () => {
    function validateDataAndShowAlert(data) {
      if (!data) {
        data !== false &&
          showCustomAlert("Please make changes to the data.", "warning");
        return false;
      }
      return true;
    }

    if (type === "chat") {
      const updatedChat =
        await conversationService.sendEditNameAndDescriptionRequest(content);
      if (!validateDataAndShowAlert(updatedChat)) {
        return;
      }

      delete updatedChat?.participants;
      dispatch(upsertChat(updatedChat));
    } else {
      const newUserObject = await usersService.edit(content, type);
      if (!validateDataAndShowAlert(newUserObject)) {
        return;
      }

      dispatch(upsertUser(newUserObject));
      dispatch(setCurrentUser(newUserObject));
      showCustomAlert("User data has been successfully updated.", "success");
    }
    closeModal();
  }, [closeModal, content, dispatch, type]);

  useKeyDown(KEY_CODES.ENTER, sendRequest);

  return (
    <div className="edit-modal__container fcc">
      <div className={`edit-modal__content--${styleName}`}>
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
