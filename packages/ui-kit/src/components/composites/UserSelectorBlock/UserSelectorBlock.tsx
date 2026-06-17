import { useCallback, useMemo, useState } from "react";

import { CustomVerticalScrollbar } from "@composites/CustomVerticalScrollbar";
import { UserSelectorBlockProps } from "@composites/UserSelectorBlock/UserSelectorBlock.types";

import { OvalLoader } from "@elements/OvalLoader";
import { UserInfo } from "@elements/UserInfo";

import { useKeyDown } from "@src/hooks/useKeyDown";

import { KEY_CODES, SEARCH_AREA_MAX_HEIGHT, SEARCH_AREA_MIN_HEIGHT } from "@utils/constants";

export const UserSelectorBlock = ({
  selectedUsers,
  onAddUser,
  onRemoveUser,
  initSelectedUsers,
  onClose,
  onCreate,
  searchInputSlot,
  searchResultsSlot,
  isSearchExpanded = false,
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
        <p className="ui:text-md ui:text-text-dark">Select users to add...</p>
      )}
    </div>
  );

  return (
    <>
      <div className="ui:flex ui:justify-between">
        <p className="ui:text-xl ui:font-normal ui:text-black">Add participants</p>
        <p className="ui:text-xl ui:font-normal ui:text-text-dark">
          {counter}/{maxCount}
        </p>
      </div>
      {searchInputSlot}
      {selectedUsersBlock}
      <div
        className="ui:flex ui:flex-col ui:overflow-hidden ui:transition-[max-height] ui:duration-700 ui:ease-out"
        style={{ maxHeight: isSearchExpanded ? SEARCH_AREA_MAX_HEIGHT : SEARCH_AREA_MIN_HEIGHT }}
      >
        <div className="ui:min-h-0 ui:overflow-auto">{searchResultsSlot}</div>
      </div>
      <hr className="ui:my-1.75 ui:h-0.5 ui:border-dashed ui:text-text-dark/40" />
      <div className="ui:-mt-1.75 ui:flex ui:items-center ui:justify-between ui:gap-2.75">
        <button className="ui:cursor-pointer ui:rounded-xl ui:px-3 ui:text-text-dark" onClick={onClose}>
          Cancel
        </button>
        {isLoading ? (
          <OvalLoader wrapperClassName="ui:px-[31px]!" height={40} width={16} />
        ) : (
          <button
            className="ui:flex ui:cursor-pointer ui:items-center ui:gap-2.75 ui:rounded-xl ui:bg-accent-500 ui:px-6 ui:py-2 ui:text-white ui:duration-150 ui:hover:bg-black"
            onClick={() => validateClick()}
          >
            {effectiveSubmitLabel}
          </button>
        )}
      </div>
    </>
  );
};
