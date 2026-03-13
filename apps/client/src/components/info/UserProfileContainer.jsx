import { useDispatch, useSelector } from "react-redux";

import useHistory from "@hooks/api/useHistory.js";

import { UserProfile } from "@sama-communications.ui-kit";

import usersService from "@services/usersService";

import { getIsMobileView } from "@store/values/IsMobileView";
import { updateNetworkState } from "@store/values/NetworkState";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { setUserIsLoggedIn } from "@store/values/UserIsLoggedIn";

export default function UserProfileContainer({}) {
  const dispatch = useDispatch();
  const history = useHistory();

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

  return (
    <UserProfile
      key="userProfile"
      user={currentUser}
      isMobile={isMobileView}
      onLogout={onLogout}
      onClose={history.closeCurrentUserProfile}
      onEditProfile={history.openEditUserProfileWindow}
      onNavigateToAuth={history.navigateToAuthPage}
    />
  );
}
