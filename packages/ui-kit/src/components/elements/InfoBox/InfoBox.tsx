import { memo } from "react";
import { clsx } from "clsx";
import { User, Mail, Phone, Pencil } from "lucide-react";

import { WrapperRoot } from "../WrapperRoot";
import type { InfoBoxProps } from "./InfoBox.types";

const INFO_ICONS = {
  phone: Phone,
  email: Mail,
  login: User,
} as const;

export const InfoBox = memo(function InfoBox({
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
  className,
  ...rest
}: InfoBoxProps) {
  if (!value && hideIfNull) return null;

  const Icon = INFO_ICONS[iconType] ?? INFO_ICONS.login;

  return (
    <WrapperRoot
      className={clsx("ui:flex ui:flex-col ui:gap-0.75 ui:rounded-xl", onClick && "ui:cursor-pointer", className)}
      onClick={onClick}
      {...rest}
    >
      <p className="ui:font-light ui:text-text-dark">{title}</p>
      <div className="ui:flex ui:items-center ui:gap-2.75 ui:rounded-xl ui:bg-text-dark/5 ui:p-2">
        {isIconEnable ? <Icon size={16} /> : null}
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
    </WrapperRoot>
  );
});
