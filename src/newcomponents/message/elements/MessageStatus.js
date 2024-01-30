import { ReactComponent as Read } from "@newicons/status/Read.svg";
import { ReactComponent as Sending } from "@newicons/status/Sending.svg";
import { ReactComponent as Sent } from "@newicons/status/Sent.svg";

export default function MessageStatus({ status }) {
  return (
    <span>
      {status ? status === "read" ? <Read /> : <Sent /> : <Sending />}
    </span>
  );
}
