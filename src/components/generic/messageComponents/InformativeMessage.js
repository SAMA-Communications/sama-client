import { useLocation, useNavigate } from "react-router-dom";

export default function InformativeMessage({
  text,
  params,
  isPrevMesssageUsers,
}) {
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();

  return (
    <div
      className={
        isPrevMesssageUsers
          ? "informative-message mt-10"
          : "informative-message"
      }
      onClick={() =>
        navigate(pathname + hash + `/participant?uid=${params?.user?.native_id}`)
      }
    >
      {text}
    </div>
  );
}
