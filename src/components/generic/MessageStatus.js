import React, { useMemo } from "react";
import { IoCheckmark, IoCheckmarkDone, IoTimeOutline } from "react-icons/io5";

export default function MessageStatus({ status }) {
  const viewStatusIcon = useMemo(() => {
    return status ? (
      status === "read" ? (
        <IoCheckmarkDone />
      ) : (
        <IoCheckmark />
      )
    ) : (
      <IoTimeOutline />
    );
  }, [status]);

  return <span>{viewStatusIcon}</span>;
}
