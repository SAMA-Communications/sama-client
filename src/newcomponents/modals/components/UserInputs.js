import EditModalInput from "../elements/EditModalInput";
import { getCurrentUser } from "@store/values/CurrentUser";
import { useSelector } from "react-redux";

export default function UserInputs({ setState }) {
  const currentUser = useSelector(getCurrentUser);

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
