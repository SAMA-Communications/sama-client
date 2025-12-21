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

  const iconColorClass = type === "white" ? "white" : "#7678e5";

  const icons = {
    sent: <Check color={iconColorClass} strokeWidth={1.5} />,
    read: <CheckCheck color={iconColorClass} strokeWidth={1.5} />,
    default: <Loader color={iconColorClass} strokeWidth={1.5} />,
  };

  return icons[status || "default"];
};
