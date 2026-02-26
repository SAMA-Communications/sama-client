import { UserProfileProps } from "./UserProfile.types";

import { getAdapters } from "../../../adapters";

import { InfoBox } from "../../elements/InfoBox";
import { UserProfileAvatar } from "../../../components/elements/UserProfileAvatar";

// import { useKeyDown } from "../../../utils/tools/useKeyDown";
import { useConfirmWindow } from "../../../hooks/useConfirmWindow";

import { RotateCcwKey, LogOut, Trash, ChevronLeft, UserRoundX } from "lucide-react";

export const UserProfile = ({ user, isMobile, onLogout }: UserProfileProps) => {
  const { useParticipants, useHistory } = getAdapters();
  const { updateCurrentUserPassword, deleteCurrentUser } = useParticipants();
  const { openEditUserProfileWindow, closeCurrentUserProfile, navigateToAuthPage } = useHistory();

  const confirm = useConfirmWindow();

  const { login, email, phone, first_name, last_name } = user;

  const isCurrentUserCantLeave = login?.startsWith("sama-user-"); // ...

  // useKeyDown(KEY_CODES.ESCAPE, closeCurrentUserProfile);

  const onDeleteUserFunc = async () => {
    const { isConfirm } = await confirm<{}>({
      title: "Delete User",
      description: `You're going to delete your "Account"`,
      icon: <UserRoundX size={40} color="red" strokeWidth={2} />,
    });
    if (!isConfirm) return;
    const isSuccess = await deleteCurrentUser();
    if (isSuccess) navigateToAuthPage();
  };

  return (
    <section className="ui:flex ui:h-full ui:w-full ui:flex-col ui:gap-2.75 ui:p-3.5 ui:md:w-100">
      <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-2.75">
        <div className="ui:flex ui:w-full ui:justify-between">
          <button
            className="ui:mb-1.5 ui:cursor-pointer ui:self-start ui:rounded-xl ui:bg-white ui:p-2 ui:shadow-btn ui:hover:bg-bg-dark ui:hover:text-white"
            onClick={closeCurrentUserProfile}
          >
            <ChevronLeft size={18} />
          </button>
        </div>
        <UserProfileAvatar user={user} />
        <div className="ui:flex ui:w-4/5 ui:flex-nowrap ui:items-center ui:justify-center ui:gap-2.75">
          {first_name ? <p className="ui:text-2xl">{first_name}</p> : null}
          {last_name ? (
            <p className="ui:overflow-hidden ui:text-2xl ui:text-ellipsis ui:whitespace-nowrap">{last_name}</p>
          ) : null}
        </div>
        <p
          className="ui:-mt-1.75 ui:cursor-pointer ui:text-center ui:text-lg ui:text-accent-500"
          onClick={openEditUserProfileWindow}
        >
          Edit User Info
        </p>
      </div>
      <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <div className="ui:flex ui:flex-1 ui:flex-col ui:gap-2.75">
        <p className="ui:mb-2.75 ui:text-xl">Personal information</p>
        <InfoBox title="Username" value={login} iconType="login" />
        <InfoBox
          title="Phone number"
          value={phone}
          iconType="phone"
          placeholder={"Enter your phone number"}
          onClick={openEditUserProfileWindow}
          isEnableToEdit={true}
        />
        <InfoBox
          title="Email address"
          value={email}
          iconType="email"
          placeholder={"Enter your email address"}
          onClick={openEditUserProfileWindow}
          isEnableToEdit={true}
        />

        <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
        <p className="ui:mb-2.75 ui:text-xl">Settings</p>
        {isCurrentUserCantLeave ? null : (
          <button
            className="ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75 ui:text-text-dark"
            onClick={() => {
              const currentPassword = window.prompt("Enter your current password:");
              if (!currentPassword) return;

              const newPassword = window.prompt("Enter a new password:");
              if (!newPassword || !currentPassword) return;

              updateCurrentUserPassword(currentPassword, newPassword);
            }}
          >
            <RotateCcwKey size={18} color="var(--color-text-dark)" />
            <p className="ui:font-light">Change password</p>
          </button>
        )}
        {isCurrentUserCantLeave ? null : (
          <button
            className="ui:mt-2.75 ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75"
            onClick={onDeleteUserFunc}
          >
            <Trash size={18} color="var(--color-danger)" />
            <p className="ui:font-light ui:text-danger">Delete account</p>
          </button>
        )}

        <hr className="ui:mt-auto ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
        <button
          className="ui:mt-2.75 ui:flex ui:cursor-pointer ui:items-center ui:justify-center ui:gap-2.75 ui:rounded-xl ui:bg-white ui:p-2 ui:text-accent-500 ui:shadow-btn ui:duration-150 ui:hover:bg-accent-500 ui:hover:text-white"
          onClick={() => {
            navigateToAuthPage();
            onLogout();
          }}
        >
          <LogOut size={18} />
          Log out
        </button>
      </div>
    </section>
  );
};
