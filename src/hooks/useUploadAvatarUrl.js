import usersService from "@services/usersService";
import {
  getCurrentUserFromParticipants,
  upsertUser,
} from "@store/values/Participants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export const useBuildAndSetAvatarsUrls = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUserFromParticipants);

  useEffect(() => {
    const { avatar_url, avatar_object } = currentUser;
    if (avatar_object && !avatar_url) {
      usersService
        .uploadAvatarsUrls({
          [avatar_object.file_id]: { _id: currentUser._id, ...avatar_object },
        })
        .then(() => {
          dispatch(
            upsertUser({
              _id: currentUser._id,
              avatar_url: avatar_object.file_url,
            })
          );
        });
    }
  }, [currentUser]);
};
