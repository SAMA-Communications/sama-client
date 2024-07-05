import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

export default function InformativeMessage({
  text,
  params,
  isPrevMesssageUsers,
}) {
  const { pathname, hash } = useLocation();

  return (
    <div
      className={"informative-message" + (isPrevMesssageUsers ? " mt-10" : "")}
      onClick={() =>
        addSuffix(pathname + hash, `/user?uid=${params?.user?.native_id}`)
      }
    >
      {text}
    </div>
  );
}
