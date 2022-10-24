import React from "react";
import { VscClose } from "react-icons/vsc";

export default function SelectedUser({ removeEl, data }) {
  return (
    <div className={"list-user-selected-box"} onClick={() => removeEl(data)}>
      <p>{data.login}</p>
      <span>
        <VscClose />
      </span>
    </div>
  );
}
