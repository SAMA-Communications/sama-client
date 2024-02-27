import { ReactComponent as Read } from "@newicons/status/Read.svg";
import { ReactComponent as Sending } from "@newicons/status/Sending.svg";
import { ReactComponent as Sent } from "@newicons/status/Sent.svg";
import { ReactComponent as ReadWhite } from "@newicons/status/ReadWhite.svg";
import { ReactComponent as SendingWhite } from "@newicons/status/SendingWhite.svg";
import { ReactComponent as SentWhite } from "@newicons/status/SentWhite.svg";

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
