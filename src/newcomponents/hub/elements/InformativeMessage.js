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
      className={
        isPrevMesssageUsers
          ? "informative-message mt-10"
          : "informative-message"
      }
      onClick={() =>
        addSuffix(pathname + hash, `/user?uid=${params?.user?._id}`)
      }
    >
      {text}
    </div>
  );
}
