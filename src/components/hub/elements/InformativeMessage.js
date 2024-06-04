import addSuffix from "@utils/navigation/add_suffix";
import { useLocation } from "react-router-dom";

export default function InformativeMessage({
  text,
  params,
  isUserExistInStore,
  isPrevMesssageUsers,
}) {
  const { pathname, hash } = useLocation();

  return (
    <div
      className={
        "informative-message" +
        (isUserExistInStore ? "" : "--disabled") +
        (isPrevMesssageUsers ? " mt-10" : "")
      }
      onClick={() =>
        isUserExistInStore
          ? addSuffix(pathname + hash, `/user?uid=${params?.user?._id}`)
          : {}
      }
    >
      {text}
    </div>
  );
}
