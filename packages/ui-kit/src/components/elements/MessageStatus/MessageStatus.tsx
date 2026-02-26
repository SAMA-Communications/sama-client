import { Check, CheckCheck, Clock } from "lucide-react";

import { MessageStatusProps } from "./MessageStatus.types";

export const MessageStatus = ({ status, message, color = "accent" }: MessageStatusProps) => {
  if (!(message || status)) return null;

  const messageStatus: "sent" | "read" | "default" = (status || message?.status || "default") as
    | "sent"
    | "read"
    | "default";

  const iconColor = color === "white" ? "white" : "#7678e5";

  const icons = {
    sent: <Check size={18} color={iconColor} />,
    read: <CheckCheck size={18} color={iconColor} />,
    default: <Clock size={18} color={iconColor} />,
  };

  return icons[messageStatus || "default"];
};
