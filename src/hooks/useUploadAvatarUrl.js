import usersService from "@services/usersService";
import { getCurrentUserById } from "@store/values/Participants";
import { updateCurrentUser } from "@store/values/CurrentUser";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export const useUploadAvatarUrl = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUserById);

  useEffect(() => {
    const { avatar_url, avatar_object } = currentUser;
    if (avatar_object && !avatar_url) {
      usersService
        .uploadAvatarsUrls({
          [avatar_object.file_id]: { _id: currentUser._id, ...avatar_object },
        })
        .then(() => {
          dispatch(updateCurrentUser({ avatar_url: avatar_object.file_url }));
        });
    }
  }, [currentUser]);
};
