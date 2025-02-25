import Read from "@icons/status/Read.svg?react";
import Sending from "@icons/status/Sending.svg?react";
import Sent from "@icons/status/Sent.svg?react";
import ReadWhite from "@icons/status/ReadWhite.svg?react";
import SendingWhite from "@icons/status/SendingWhite.svg?react";
import SentWhite from "@icons/status/SentWhite.svg?react";

export default function MessageStatus({ status, type }) {
  const iconColor = type === "white" ? "white" : "accent";

  const iconMap = {
    accent: { sent: <Sent />, read: <Read />, default: <Sending /> },
    white: {
      sent: <SentWhite />,
      read: <ReadWhite />,
      default: <SendingWhite />,
    },
  };

  return iconMap[iconColor][status || "default"];
}
