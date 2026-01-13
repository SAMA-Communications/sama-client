import { InfoBox } from "../../../components/elements/InfoBox";

import { getAdapters } from "../../../adapters";
import { UserProfileAvatar } from "../../../components/elements/UserProfileAvatar";

interface UserInputsGroupProps {
  onChageValue: (name: string, value: string) => void;
}

export const UserInputsGroup = ({ onChageValue }: UserInputsGroupProps) => {
  const { useParticipants } = getAdapters();
  const { getCurrentUser } = useParticipants();
  const { first_name, last_name, email, phone } = getCurrentUser();

  return (
    <>
      <UserProfileAvatar swapAccentAndMainColor={true} />
      <InfoBox
        title={"First name"}
        value={first_name}
        systemTitle={"first_name"}
        isIconEnable={false}
        onChangeValue={onChageValue}
      />
      <InfoBox
        title={"Last name"}
        value={last_name}
        systemTitle={"last_name"}
        isIconEnable={false}
        onChangeValue={onChageValue}
      />
      <InfoBox
        title={"Mobile phone"}
        value={phone}
        systemTitle={"phone"}
        isIconEnable={false}
        onChangeValue={onChageValue}
      />
      <InfoBox
        title={"Email address"}
        value={email}
        systemTitle={"email"}
        isIconEnable={false}
        onChangeValue={onChageValue}
      />
    </>
  );
};
