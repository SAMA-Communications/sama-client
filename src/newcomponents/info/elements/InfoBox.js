import { ReactComponent as Email } from "@newicons/media/Email.svg";
import { ReactComponent as Phone } from "@newicons/media/Phone.svg";
import { ReactComponent as User } from "@newicons/users/User.svg";

export default function InfoBox({
  className = "",
  modifier = "",
  iconType = "login",
  title,
  placeholder = "",
  value,
  hideIfNull = false,
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
    <div className={`info__box${modifier} ${className}`}>
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
