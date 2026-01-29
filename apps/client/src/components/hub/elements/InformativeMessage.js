import { useLocation } from "react-router";

import { addSuffix } from "@utils/NavigationUtils.js";

export default function InformativeMessage({ text, params, isNextMesssageUsers }) {
  const { pathname, hash } = useLocation();

  return (
    <div
      className={
        "bg-hover-light cursor-pointer self-center rounded-xl px-3 py-2 text-gray-500" +
        (isNextMesssageUsers ? " mb-1.5" : "")
      }
      onClick={() => addSuffix(pathname + hash, `/user?uid=${params?.user?._id}`)}
    >
      <p className="font-light">{text}</p>
    </div>
  );
}
