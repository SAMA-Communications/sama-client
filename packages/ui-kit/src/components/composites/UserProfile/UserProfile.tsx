import { UserProfileProps } from "./UserProfile.types";

import { getAdapters } from "../../../adapters";

import { Pencil, RotateCcwKey, LogOut, Trash, X, Undo2 } from "lucide-react";

import { CustomScrollBar } from "./../../CustomScrollBar";
import { InfoBox } from "../../elements/InfoBox";

import { UserProfileAvatar } from "../../../components/elements/UserProfileAvatar";

// import { useKeyDown } from "../../../utils/tools/useKeyDown";

export const UserProfile = ({
  user,
  isMobile,
  shareRef,
  onLogout,
  triggerExitEvent,
}: UserProfileProps) => {
  const { useParticipants, useHistory } = getAdapters();
  const { updateCurrentUserPassword, deleteCurrentUser } = useParticipants();
  const {
    openEditUserProfileWindow,
    closeCurrentUserProfile,
    navigateToAuthPage,
  } = useHistory();

  const { login, email, phone, first_name, last_name } = user;

  const isCurrentUserCantLeave = login?.startsWith("sama-user-"); // ...

  // useKeyDown(KEY_CODES.ESCAPE, closeCurrentUserProfile);

  return (
    <section
      ref={shareRef}
      className="h-full overflow-hidden max-md:h-dvh max-md:!w-dvw md:mr-[15px] md:w-[400px]"
    >
      <CustomScrollBar childrenClassName="py-[20px] flex flex-col gap-[15px] max-md:py-[0px]">
        <div className="relative flex flex-col items-center justify-center gap-[12px] rounded-[32px] bg-(--color-accent-light) p-[30px] max-md:rounded-t-[0px]">
          {isMobile ? (
            <Undo2
              strokeWidth={1}
              size={25}
              className="absolute top-[30px] right-[30px] cursor-pointer max-md:top-[34px] max-md:left-[4svw]"
              onClick={closeCurrentUserProfile}
            />
          ) : (
            <X
              strokeWidth={1}
              size={25}
              className="absolute top-[30px] right-[30px] cursor-pointer"
              onClick={closeCurrentUserProfile}
            />
          )}

          <UserProfileAvatar />
          <div className="flex w-[90%] flex-nowrap items-center justify-center gap-[12px] overflow-hidden !font-normal text-ellipsis whitespace-nowrap">
            {first_name ? (
              <p className="text-h4 !font-normal text-black">{first_name}</p>
            ) : null}
            {last_name ? (
              <p className="text-h4 !font-normal text-black">{last_name}</p>
            ) : null}
          </div>
          <div
            className="text-h6 flex w-full cursor-pointer items-center justify-center gap-[8px] rounded-[12px] bg-(--color-accent-dark) py-[6px] !font-normal text-white"
            onClick={openEditUserProfileWindow}
          >
            Edit Profile <Pencil strokeWidth={1} size={18} color="white" />
          </div>
        </div>
        <div className="flex flex-1 flex-col rounded-[32px] bg-(--color-bg-light) px-[20px] py-[30px] max-md:flex-1 max-md:rounded-b-[0px]">
          <p className="text-h5 mb-[10px] !font-normal text-(--color-text-dark)">
            Personal information
          </p>
          <InfoBox
            title="Username"
            value={login}
            iconType="login"
            isEnableToEdit={false}
          />
          <InfoBox
            title="Phone"
            value={phone}
            iconType="phone"
            placeholder={"Enter your phone number"}
            onClick={openEditUserProfileWindow}
          />
          <InfoBox
            title="Email"
            value={email}
            iconType="email"
            placeholder={"Enter your email address"}
            onClick={openEditUserProfileWindow}
          />

          <hr style={{ borderColor: "lightgray", marginBlock: 20 }} />
          <p className="text-h5 mb-[10px] !font-normal text-(--color-text-dark)">
            Settings
          </p>
          {isCurrentUserCantLeave ? null : (
            <div className="flex cursor-pointer items-center gap-[10px] px-[10px]">
              <RotateCcwKey strokeWidth={1} size={18} />
              <p
                onClick={() => {
                  const currentPassword = window.prompt(
                    "Enter your current password:",
                  );
                  if (!currentPassword) return;

                  const newPassword = window.prompt("Enter a new password:");
                  if (!newPassword || !currentPassword) return;

                  updateCurrentUserPassword(currentPassword, newPassword);
                }}
              >
                Change password...
              </p>
            </div>
          )}
          {isMobile ? (
            <div className="mt-[30px] flex cursor-pointer items-center gap-[10px] px-[10px] max-md:mt-[20px]">
              <LogOut strokeWidth={1} size={18} />
              <p
                onClick={() => {
                  navigateToAuthPage();
                  triggerExitEvent();
                  onLogout();
                }}
              >
                Log out
              </p>
            </div>
          ) : null}
          {isCurrentUserCantLeave ? null : (
            <div className="mt-auto flex cursor-pointer items-center gap-[10px] px-[10px]">
              <Trash strokeWidth={1} size={18} color="var(--color-red)" />
              <p
                className="text-(--color-red)"
                onClick={async () => {
                  const isSuccess = await deleteCurrentUser();
                  if (isSuccess) {
                    navigateToAuthPage();
                    triggerExitEvent();
                  }
                }}
              >
                Delete account
              </p>
            </div>
          )}
        </div>
      </CustomScrollBar>
    </section>
  );
};
