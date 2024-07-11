import EditModalInput from "@components/modals/elements/EditModalInput";
import { getCurrentUserFromParticipants } from "@store/values/Participants";
import { useSelector } from "react-redux";

export default function UserContactsInput({ setState }) {
  const { email, phone } = useSelector(getCurrentUserFromParticipants);

  return (
    <>
      <EditModalInput
        title={"Mobile phone"}
        value={phone}
        systemTitle={"phone"}
        onChageFunc={setState}
      />
      <EditModalInput
        title={"Email address"}
        value={email}
        systemTitle={"email"}
        onChageFunc={setState}
      />
    </>
  );
}
