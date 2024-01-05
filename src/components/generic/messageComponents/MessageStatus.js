import React, { useMemo } from "react";

import { ReactComponent as StatusRead } from "@icons/messageStatuses/StatusRead.svg";
import { ReactComponent as StatusSend } from "@icons/messageStatuses/StatusSend.svg";
import { ReactComponent as StatusSending } from "@icons/messageStatuses/StatusSending.svg";

export default function MessageStatus({ status }) {
  const viewStatusIcon = useMemo(() => {
    return status ? (
      status === "read" ? (
        <StatusRead />
      ) : (
        <StatusSend />
      )
    ) : (
      <StatusSending />
    );
  }, [status]);

  return <span>{viewStatusIcon}</span>;
}
