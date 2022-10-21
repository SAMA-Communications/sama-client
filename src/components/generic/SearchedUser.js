import React from "react";

export default function SearchedUser({ addEl, list }) {
  return (
    <div className="list-users">
      {list.length ? (
        list.map((d) => (
          <div key={d._id} className={"list-user-box"} onClick={() => addEl(d)}>
            <p>User: {d.login}</p>
          </div>
        ))
      ) : (
        <div className="list-user-message">Users not found</div>
      )}
    </div>
  );
}
