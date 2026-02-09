import { UserProfileProps } from "./UserProfile.types";

import { getAdapters } from "../../../adapters";

import { CustomScrollBar } from "../CustomScrollBar";
import { InfoBox } from "../../elements/InfoBox";
import { UserProfileAvatar } from "../../../components/elements/UserProfileAvatar";

// import { useKeyDown } from "../../../utils/tools/useKeyDown";

import { Pencil, RotateCcwKey, LogOut, Trash, ChevronLeft } from "lucide-react";

export const UserProfile = ({ user, isMobile, onLogout }: UserProfileProps) => {
  const { useParticipants, useHistory } = getAdapters();
  const { updateCurrentUserPassword, deleteCurrentUser } = useParticipants();
  const { openEditUserProfileWindow, closeCurrentUserProfile, navigateToAuthPage } = useHistory();

  const { login, email, phone, first_name, last_name } = user;

  const isCurrentUserCantLeave = login?.startsWith("sama-user-"); // ...

  // useKeyDown(KEY_CODES.ESCAPE, closeCurrentUserProfile);

  return (
    <section className="ui:h-full ui:w-full ui:gap-2.75 ui:p-3.5 ui:md:w-100">
      <CustomScrollBar childrenClassName="ui:flex ui:flex-col">
        <div className="ui:relative ui:flex ui:flex-col ui:items-center ui:justify-center ui:gap-2.75">
          <button
            className="ui:mb-1.5 ui:cursor-pointer ui:self-start ui:rounded-xl ui:border ui:border-text-dark ui:p-2"
            onClick={closeCurrentUserProfile}
          >
            <ChevronLeft size={18} />
          </button>
          <UserProfileAvatar />
          <div className="ui:flex ui:w-4/5 ui:flex-nowrap ui:items-center ui:justify-center ui:gap-2.75">
            {first_name ? <p className="ui:text-2xl">{first_name}</p> : null}
            {last_name ? (
              <p className="ui:overflow-hidden ui:text-2xl ui:text-ellipsis ui:whitespace-nowrap">{last_name}</p>
            ) : null}
          </div>
          <button
            className="ui:mt-2.75 ui:flex ui:w-full ui:cursor-pointer ui:items-center ui:justify-center ui:gap-2.75 ui:rounded-xl ui:border ui:border-accent-500 ui:p-2 ui:text-accent-500 ui:duration-150 ui:hover:bg-accent-500/15"
            onClick={openEditUserProfileWindow}
          >
            Edit Profile <Pencil size={18} color="var(--color-accent-500)" />
          </button>
        </div>
        <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:text-text-dark/40" />
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

          <hr className="ui:mt-5 ui:mb-2.5 ui:h-0.5 ui:text-text-dark/40" />
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
              onClick={async () => {
                const isSuccess = await deleteCurrentUser();
                if (isSuccess) {
                  navigateToAuthPage();
                }
              }}
            >
              <Trash size={18} color="var(--color-danger)" />
              <p className="ui:font-light ui:text-danger">Delete account</p>
            </button>
          )}

          <hr className="ui:mt-auto ui:mb-2.5 ui:h-0.5 ui:text-text-dark/40" />
          <button
            className="ui:mt-2.75 ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75 ui:rounded-xl ui:border ui:border-accent-500 ui:p-2 ui:duration-150 ui:hover:bg-accent-500/15"
            onClick={() => {
              navigateToAuthPage();
              onLogout();
            }}
          >
            <LogOut size={18} color="var(--color-accent-500)" />
            <p className="ui:text-accent-500">Log out</p>
          </button>
        </div>
      </CustomScrollBar>
    </section>
  );
};
