import { User, Mail, Phone, Pencil } from "lucide-react";

import { InfoBoxProps } from "./InfoBox.types";

export const InfoBox = ({
  title,
  systemTitle,
  value,
  iconType = "login",
  placeholder = "",
  hideIfNull = false,
  isEnableToEdit = false,
  isIconEnable = true,
  onClick,
  onChangeValue,
}: InfoBoxProps) => {
  if (!value && hideIfNull) return null;

  const infoIcons = {
    phone: <Phone size={16} />,
    email: <Mail size={16} />,
    login: <User size={16} />,
  };

  return (
    <div
      className={`ui:flex ui:flex-col ui:gap-0.75 ui:rounded-xl ${onClick && "ui:cursor-pointer"}`}
      onClick={onClick}
    >
      <p className="ui:text-text-dark">{title}</p>
      <div className="ui:flex ui:items-center ui:gap-2.75 ui:rounded-xl ui:border ui:border-text-dark ui:p-2">
        {isIconEnable ? infoIcons[iconType] : null}
        {onChangeValue && systemTitle ? (
          <input
            className="ui:grow ui:font-light ui:focus:outline-none"
            defaultValue={value || ""}
            placeholder={"Empty"}
            onChange={(e) => onChangeValue(systemTitle, e.target.value)}
          />
        ) : (
          <p className="ui:grow ui:overflow-hidden ui:text-base ui:font-light ui:text-ellipsis ui:whitespace-nowrap ui:text-black">
            {value || <span className="ui:text-text-dark">{placeholder}</span>}
          </p>
        )}
        {isEnableToEdit && !onChangeValue ? <Pencil size={18} color="var(--color-accent-500)" /> : null}
      </div>
    </div>
  );
};
