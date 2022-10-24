import React from "react";

export default function SearchedUser({ addEl, data }) {
  return (
    <div className={"list-user-box"} onClick={() => addEl(data)}>
      <p>User: {data.login}</p>
    </div>
  );
}
