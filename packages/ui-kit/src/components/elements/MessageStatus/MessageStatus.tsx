import { memo } from "react";
import { Check, CheckCheck, Clock } from "lucide-react";

import { WrapperRoot } from "../WrapperRoot";
import type { MessageStatusProps } from "./MessageStatus.types";

const ICONS = {
  sent: Check,
  read: CheckCheck,
  default: Clock,
} as const;

export const MessageStatus = memo(function MessageStatus({
  status,
  message,
  color = "accent",
  className,
  ...rest
}: MessageStatusProps) {
  if (!(message || status)) return null;

  const messageStatus: keyof typeof ICONS = (status || message?.status || "default") as keyof typeof ICONS;
  const iconColor = color === "white" ? "white" : "#7678e5";
  const Icon = ICONS[messageStatus] ?? ICONS.default;

  return (
    <WrapperRoot as="span" className={className} {...rest}>
      <Icon size={18} color={iconColor} />
    </WrapperRoot>
  );
});
