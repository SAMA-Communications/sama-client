import Email from "@icons/media/Email.svg?react";
import Phone from "@icons/media/Phone.svg?react";
import User from "@icons/users/User.svg?react";

export default function InfoBox({
  className = "",
  modifier = "",
  iconType = "login",
  title,
  placeholder = "",
  value,
  hideIfNull = false,
  onClickFunc,
}) {
  if (!value && hideIfNull) {
    return;
  }
  const infoIcons = {
    mobile: <Phone />,
    email: <Email />,
    login: <User />,
  };

  return (
    <div className={`info__box${modifier} ${className}`} onClick={onClickFunc}>
      <div>
        {infoIcons[iconType]}
        <p>{title}</p>
      </div>
      <p className={`info__${iconType}`}>
        {value || <span className="text-gray">{placeholder}</span>}
      </p>
    </div>
  );
}
