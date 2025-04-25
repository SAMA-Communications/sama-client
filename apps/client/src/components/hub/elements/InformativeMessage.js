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
        "self-center py-[6px] px-[18px] rounded-[16px] bg-(--color-hover-light) cursor-pointer text-gray-500" +
        (isPrevMesssageUsers ? " mt-[10px]" : "")
      }
      onClick={() =>
        addSuffix(pathname + hash, `/user?uid=${params?.user?._id}`)
      }
    >
      {text}
    </div>
  );
}
