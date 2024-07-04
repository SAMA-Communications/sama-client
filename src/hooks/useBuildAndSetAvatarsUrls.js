import usersService from "@services/usersService";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export const useBuildAndSetAvatarsUrls = () => {
  const currentUser = useSelector(getCurrentUserFromParticipants);

  useEffect(() => {
    const { _id: userId, avatar_url, avatar_object } = currentUser;
    if (avatar_object && !avatar_url) {
      usersService.uploadAvatarsUrls({
        [avatar_object.file_id]: { _id: userId, ...avatar_object },
      });
    }
  }, [currentUser]);
};
