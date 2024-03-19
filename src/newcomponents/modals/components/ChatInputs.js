import { getConverastionById } from "@store/values/Conversations";
import EditModalInput from "../elements/EditModalInput";
import { useSelector } from "react-redux";

export default function PersonalInputs({ setState }) {
  const selectedConversation = useSelector(getConverastionById);

  return (
    <>
      <EditModalInput
        title={"Group name"}
        value={selectedConversation.name}
        systemTitle={"name"}
        onChageFunc={setState}
      />
      <EditModalInput
        title={"Description"}
        value={selectedConversation.description}
        systemTitle={"description"}
        onChageFunc={setState}
      />
    </>
  );
}
