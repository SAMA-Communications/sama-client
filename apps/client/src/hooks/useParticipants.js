import api from "@api/api.js";

import DownloadManager from "@lib/downloadManager.js";

import store from "@store/store.js";
import { upsertUser } from "@store/values/Participants.js";

import { showCustomAlert } from "@utils/GeneralUtils.js";
import { isHeic, processFile } from "@utils/MediaUtils.js";
import {
  validateFieldLength,
  validateIsEmptyObject,
} from "@utils/ValidationGeneral.js";
import { validateEmail, validatePhone } from "@utils/ValidationUser.js";

export default function useParticipants() {
  const getParticipantsByIds = (uids, asObject = true) => {
    if (!uids?.length) return asObject ? {} : [];

    const participants = store.getState()?.participants?.entities || {};

    return uids.reduce(
      (acc, uid) => {
        if (participants[uid]) {
          asObject
            ? (acc[uid] = participants[uid])
            : acc.push(participants[uid]);
        }
        return acc;
      },
      asObject ? {} : []
    );
  };

  const getParticipantsByIdsAsObject = (uids) => {
    return getParticipantsByIds(uids, true);
  };

  const getParticipantsByIdsAsList = (uids) => {
    return getParticipantsByIds(uids, false);
  };

  const getCurrentUser = () => {
    const currentUserId = store.getState()?.currentUserId.value.id;
    const currentUser = store.getState()?.participants?.entities[currentUserId];
    return currentUser;
  };

  const getUserById = (uid) => {
    const currentUser = store.getState()?.participants?.entities[uid];
    return currentUser;
  };

  const updateCurrentUserAvatar = async (file) => {
    if (!file) return;

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
  };

  const updateCurrentUserPassword = async (currentPassword, newPassword) => {
    if (validateFieldLength(newPassword, 3, 40, "password")) return;

    try {
      await api.userEdit({
        current_password: currentPassword,
        new_password: newPassword,
      });
      showCustomAlert("Password has been successfully updated.", "success");
    } catch (err) {
      showCustomAlert(err.message, "danger");
    }
  };

  const updateCurrentUserFields = async (data) => {
    if (validateIsEmptyObject(data)) return true;

    if (
      validateFieldLength(data.first_name, 1, 20, "first name") ||
      validateFieldLength(data.last_name, 1, 20, "last name")
    ) {
      return false;
    }

    if (validateEmail(data.email) || validatePhone(data.phone)) return false;

    try {
      const updatedUser = await api.userEdit(data);
      store.dispatch(upsertUser(updatedUser));
      showCustomAlert("User data has been successfully updated.", "success");
      return true;
    } catch (err) {
      showCustomAlert(err.message, "danger");
      return false;
    }
  };

  const deleteCurrentUser = async () => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.userDelete();
        store.dispatch({ type: "RESET_STORE" });
        localStorage.clear();
        localStorage.setItem("isUsedBefore", true);
        return true;
      } catch (err) {
        showCustomAlert(err.message, "danger");
        return false;
      }
    } else {
      return false;
    }
  };

  return {
    getParticipantsByIdsAsObject,
    getParticipantsByIdsAsList,
    getCurrentUser,
    getUserById,

    updateCurrentUserAvatar,
    updateCurrentUserPassword,
    updateCurrentUserFields,

    deleteCurrentUser,
  };
}
