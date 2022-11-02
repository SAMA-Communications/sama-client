import React from "react";
import { VscClose } from "react-icons/vsc";

export default function SelectedUser({ uLogin, onClick }) {
  return (
    <div className={"list-user-selected-box"} onClick={onClick}>
      <p>{uLogin}</p>
      <span>
        <VscClose />
      </span>
    </div>
  );
}
