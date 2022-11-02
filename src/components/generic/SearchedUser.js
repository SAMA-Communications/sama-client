import React from "react";

export default function SearchedUser({ uLogin, onClick }) {
  return (
    <div className={"list-user-box"} onClick={onClick}>
      <p>User: {uLogin}</p>
    </div>
  );
}
