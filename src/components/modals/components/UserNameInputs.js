import EditModalInput from "@components/modals/elements/EditModalInput";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { useSelector } from "react-redux";

export default function UserNameInputs({ setState }) {
  const { first_name, last_name } = useSelector(getCurrentUserFromParticipants);

  return (
    <>
      <EditModalInput
        title={"First name"}
        value={first_name}
        systemTitle={"first_name"}
        onChageFunc={setState}
      />
      <EditModalInput
        title={"Last name"}
        value={last_name}
        systemTitle={"last_name"}
        onChageFunc={setState}
      />
    </>
  );
}
