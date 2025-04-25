import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

import conversationService from "@services/conversationsService";
import usersService from "@services/usersService";
import { useKeyDown } from "@hooks/useKeyDown";

import GroupDetailsInputs from "@components/modals/components/GroupDetailsInputs";
import UserContactsInput from "@components/modals/components/UserContactsInput";
import UserNameInputs from "@components/modals/components/UserNameInputs";

import { upsertChat } from "@store/values/Conversations";
import { upsertUser } from "@store/values/Participants";

import removeAndNavigateLastSection from "@utils/navigation/get_prev_page";
import showCustomAlert from "@utils/show_alert";
import { KEY_CODES } from "@utils/global/keyCodes";

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
      style: "w-[min(460px,100%)]",
    },
    personal: {
      component: <UserContactsInput setState={addFieldToEdit} />,
      title: "Edit personal info",
      style: "w-[min(360px,100%)]",
    },
    user: {
      component: <UserNameInputs setState={addFieldToEdit} />,
      title: "Edit your name",
      style: "w-[min(360px,100%)]",
    },
  };

  const type = (search || hash).split("=")[1];
  const { component, title, style } = types[type] || {};

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
      content.email && (content.email = content.email.toLocaleLowerCase());
      const newUserObject = await usersService.edit(content, type);
      if (!validateDataAndShowAlert(newUserObject)) {
        return;
      }

      dispatch(upsertUser(newUserObject));
      showCustomAlert("User data has been successfully updated.", "success");
    }
    closeModal();
  }, [closeModal, content, dispatch, type]);

  useKeyDown(KEY_CODES.ENTER, sendRequest);

  return (
    <div className="absolute top-[0px] w-dvw h-dvh bg-(--color-black-50) flex items-center justify-center">
      <div
        className={`p-[30px] flex flex-col gap-[20px] rounded-[32px] bg-(--color-bg-light) max-md:w-[94svw] max-md:p-[20px] ${style}`}
      >
        <p className="text-h5 !font-normal text-black">{title}</p>
        <div className="flex flex-col gap-[15px]">{component}</div>
        <div className="mt-auto justify-end gap-[30px] flex items-center">
          <p
            className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
            onClick={closeModal}
          >
            Cancel
          </p>
          <p
            className="text-h6 text-(--color-accent-dark) !forn-light cursor-pointer"
            onClick={sendRequest}
          >
            Save
          </p>
        </div>
      </div>
    </div>
  );
}
