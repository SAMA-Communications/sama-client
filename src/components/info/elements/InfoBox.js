import { motion } from "framer-motion";
import { animateUserProfileContent } from "@src/animations/animateUserProfile";

import { ReactComponent as Email } from "@icons/media/Email.svg";
import { ReactComponent as Phone } from "@icons/media/Phone.svg";
import { ReactComponent as User } from "@icons/users/User.svg";

export default function InfoBox({
  className = "",
  modifier = "",
  iconType = "login",
  title,
  placeholder = "",
  value,
  hideIfNull = false,
  isAnimate = false,
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
    <motion.div
      className={`info__box${modifier} ${className}`}
      onClick={onClickFunc}
      variants={isAnimate ? animateUserProfileContent : {}}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div>
        {infoIcons[iconType]}
        <p>{title}</p>
      </div>
      <p className={`info__${iconType}`}>
        {value || <span className="text-gray">{placeholder}</span>}
      </p>
    </motion.div>
  );
}
