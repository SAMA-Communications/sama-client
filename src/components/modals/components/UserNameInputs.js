import EditModalInput from "@components/modals/elements/EditModalInput";
import { selectCurrentUser } from "@store/values/CurrentUser";
import { useSelector } from "react-redux";

export default function UserNameInputs({ setState }) {
  const currentUser = useSelector(selectCurrentUser);

  return (
    <>
      <EditModalInput
        title={"First name"}
        value={currentUser.first_name}
        systemTitle={"first_name"}
        onChageFunc={setState}
      />
      <EditModalInput
        title={"Last name"}
        value={currentUser.last_name}
        systemTitle={"last_name"}
        onChageFunc={setState}
      />
    </>
  );
}
