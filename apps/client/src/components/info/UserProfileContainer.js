import { useDispatch, useSelector } from "react-redux";

import usersService from "@services/usersService";

import { UserProfile } from "@sama-communications.ui-kit";

import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { getIsMobileView } from "@store/values/IsMobileView";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";
import { updateNetworkState } from "@store/values/NetworkState";

export default function UserProfileContainer({}) {
  const dispatch = useDispatch();

  const isMobileView = useSelector(getIsMobileView);

  const currentUser = useSelector(getCurrentUserFromParticipants);

  const onLogout = async () => {
    try {
      await usersService.logout();
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
    } catch (err) {
      dispatch({ type: "RESET_STORE" });
      dispatch(updateNetworkState(true));
      dispatch(setUserIsLoggedIn(false));
    }
  };

  return <UserProfile key="userProfile" user={currentUser} isMobile={isMobileView} onLogout={onLogout} />;
}
