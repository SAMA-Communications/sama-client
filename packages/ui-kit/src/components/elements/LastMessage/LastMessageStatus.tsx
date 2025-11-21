import { Check, CheckCheck, Loader } from "lucide-react";

import { Message } from "types/samaWssModels";

export interface LastMessageStatusProps {
  message?: Message;
  type?: "accent" | "white";
  isCurrentUser: boolean;
}

export const LastMessageStatus = ({
  message,
  type = "accent",
  isCurrentUser,
}: LastMessageStatusProps) => {
  if (!message || !isCurrentUser) return null;

  const { status } = message as { status: "sent" | "read" };

  const iconColorClass =
    type === "white" ? "text-white" : "text-(--color-accent)";

  const icons = {
    sent: <Check className={iconColorClass} strokeWidth={1.5} />,
    read: <CheckCheck className={iconColorClass} strokeWidth={1.5} />,
    default: <Loader className={iconColorClass} strokeWidth={1.5} />,
  };

  return icons[status || "default"];
};
