import { User, Mail, Phone, Pencil } from "lucide-react";

import { InfoBoxProps } from "./InfoBox.types";

export const InfoBox = ({
  title,
  systemTitle,
  value,
  iconType = "login",
  placeholder = "",
  hideIfNull = false,
  isEnableToEdit = true,
  isIconEnable = true,
  onClick,
  onChangeValue,
}: InfoBoxProps) => {
  if (!value && hideIfNull) return null;

  const infoIcons = {
    phone: <Phone strokeWidth={1} size={16} />,
    email: <Mail strokeWidth={1} size={16} />,
    login: <User strokeWidth={1} size={16} />,
  };

  return (
    <div
      className={`flex flex-col gap-1 rounded-[16px] px-[10px] py-[15px] hover:bg-(--color-white) max-md:gap-[5px] max-md:p-[10px] ${onClick && "cursor-pointer"}`}
      onClick={onClick}
    >
      <div className="flex items-center gap-[10px]">
        {isIconEnable ? infoIcons[iconType] : null}
        <p>{title}</p>
      </div>
      {onChangeValue && systemTitle ? (
        <input
          style={{
            borderColor: "var(--color-accent-dark)",
            backgroundColor: "#F0F0FF",
          }}
          className="text-h6 flex items-center justify-between rounded-lg border px-2 py-1 !font-light focus:outline-none"
          defaultValue={value || ""}
          placeholder={"Empty"}
          onChange={(e) => onChangeValue(systemTitle, e.target.value)}
        />
      ) : (
        <div
          style={{
            borderColor: "var(--color-accent-dark)",
            backgroundColor: "#F0F0FF",
          }}
          className="flex items-center justify-between rounded-lg border px-2 py-1"
        >
          <p className="text-h6 overflow-hidden pl-[26px] text-ellipsis whitespace-nowrap text-black">
            {value || (
              <span className="text-h6 text-(--color-text-dark)">
                {placeholder}
              </span>
            )}
          </p>
          {isEnableToEdit ? (
            <Pencil
              strokeWidth={1}
              size={18}
              color="var(--color-accent-dark)"
            />
          ) : null}
        </div>
      )}
    </div>
  );
};
