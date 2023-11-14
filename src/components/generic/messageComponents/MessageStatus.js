import React, { useMemo } from "react";

import { ReactComponent as StatusRead } from "./../../../assets/icons/messageStatuses/StatusRead.svg";
import { ReactComponent as StatusSend } from "./../../../assets/icons/messageStatuses/StatusSend.svg";
import { ReactComponent as StatusSending } from "./../../../assets/icons/messageStatuses/StatusSending.svg";

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
