import { useCallback, useMemo, useState } from "react";

import type { User } from "types/samaWssModels";

import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";
import { UserSelectorBlockProps } from "@composites/UserSelectorBlock/UserSelectorBlock.types";

import { OvalLoader } from "@elements/OvalLoader";
import { UserInfo } from "@elements/UserInfo";

import { useKeyDown } from "@src/hooks/useKeyDown";

import { KEY_CODES } from "@utils/constants";

export const UserSelectorBlock = ({
  selectedUsers,
  onAddUser,
  onRemoveUser,
  initSelectedUsers,
  onClose,
  onCreate,
  searchInputSlot,
  searchResultsSlot,
  maxCount = 50,
  submitLabel,
}: UserSelectorBlockProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const meInArray = initSelectedUsers ? 0 : 1;
  const counter = selectedUsers.length + meInArray;
  const effectiveSubmitLabel = submitLabel ?? (initSelectedUsers?.length ? "Add" : "Create");

  const filteredUsers = useMemo(() => {
    if (initSelectedUsers?.length) {
      return selectedUsers.filter((u) => !initSelectedUsers.some((init) => init._id === u._id));
    }
    return selectedUsers;
  }, [selectedUsers, initSelectedUsers]);

  const validateClick = useCallback(async () => {
    const usersToSubmit = initSelectedUsers?.length
      ? selectedUsers.filter((u) => !initSelectedUsers.some((init) => init._id === u._id))
      : selectedUsers;
    setIsLoading(true);
    try {
      await onCreate(usersToSubmit);
    } finally {
      setIsLoading(false);
    }
  }, [selectedUsers, initSelectedUsers, onCreate]);

  useKeyDown(KEY_CODES.ENTER, validateClick);

  const selectedUsersBlock = (
    <div className="ui:-mt-[5px] ui:-mb-[5px] ui:flex ui:max-h-[64px] ui:min-h-[32px] ui:items-center">
      {filteredUsers.length ? (
        <CustomVerticalScrollbar childrenClassName="ui:flex ui:flex-row ui:gap-[7px] ui:rounded-[8px]">
          {filteredUsers.map((u) => (
            <UserInfo key={u._id} user={u} onRemove={() => onRemoveUser(u)} />
          ))}
        </CustomVerticalScrollbar>
      ) : (
        <p className="ui:text-h6">Select users to add...</p>
      )}
    </div>
  );

  return (
    <>
      <div className="ui:flex ui:justify-between">
        <p className="ui:text-h5 ui:font-normal ui:text-black">Add participants</p>
        <p className="ui:text-h5 ui:font-normal ui:text-text-dark">
          {counter}/{maxCount}
        </p>
      </div>
      {searchInputSlot}
      {selectedUsersBlock}
      {searchResultsSlot}
      <div className="ui:mt-auto ui:flex ui:items-center ui:justify-end ui:gap-[30px]">
        <p className="ui:text-h6 ui:cursor-pointer ui:font-light ui:text-accent-500" onClick={onClose}>
          Cancel
        </p>
        {isLoading ? (
          <OvalLoader wrapperClassName="ui:p-[0px]!" height={60} width={23} />
        ) : (
          <p className="ui:text-h6 ui:cursor-pointer ui:font-light ui:text-accent-500" onClick={() => validateClick()}>
            {effectiveSubmitLabel}
          </p>
        )}
      </div>
    </>
  );
};
