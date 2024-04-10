import EditModalInput from "@components/modals/elements/EditModalInput";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { useSelector } from "react-redux";

export default function UserContactsInput({ setState }) {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <>
      <EditModalInput
        title={"Mobile phone"}
        value={currentUser.phone}
        systemTitle={"phone"}
        onChageFunc={setState}
      />
      <EditModalInput
        title={"Email address"}
        value={currentUser.email}
        systemTitle={"email"}
        onChageFunc={setState}
      />
    </>
  );
}
