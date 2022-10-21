import React from "react";
import { VscClose } from "react-icons/vsc";

export default function SelectedUser({ removeEl, list }) {
  return (
    <div className="chat-selected-users">
      {list.length
        ? list.map((d) => (
            <div
              key={d._id + "-selected"}
              className={"list-user-selected-box"}
              onClick={() => removeEl(d)}
            >
              <p>{d.login}</p>
              <span>
                <VscClose />
              </span>
            </div>
          ))
        : ""}
    </div>
  );
}
