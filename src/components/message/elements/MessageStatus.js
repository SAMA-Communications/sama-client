import { ReactComponent as Read } from "@icons/status/Read.svg";
import { ReactComponent as Sending } from "@icons/status/Sending.svg";
import { ReactComponent as Sent } from "@icons/status/Sent.svg";
import { ReactComponent as ReadWhite } from "@icons/status/ReadWhite.svg";
import { ReactComponent as SendingWhite } from "@icons/status/SendingWhite.svg";
import { ReactComponent as SentWhite } from "@icons/status/SentWhite.svg";
import { ReactComponent as DecryptionFailed } from "@icons/status/DecryptionFailed.svg";

export default function MessageStatus({ status, type }) {
  const iconColor = type === "white" ? "white" : "accent";

  const iconMap = {
    accent: {
      sent: <Sent />,
      read: <Read />,
      decryption_failed: <DecryptionFailed />,
      default: <Sending />,
    },
    white: {
      sent: <SentWhite />,
      read: <ReadWhite />,
      decryption_failed: <DecryptionFailed />,
      default: <SendingWhite />,
    },
  };

  return iconMap[iconColor][status || "default"];
}
