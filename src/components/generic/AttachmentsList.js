import getUniqueId from "../../api/uuid";

export default function AttachmentsList({ files, funcUpdateFile }) {
  return (
    <div className="chat-files-preview">
      <div className="chat-files-block">
        {Object.values(files).map((el) => (
          <div
            className="file-pin-box"
            key={getUniqueId(el.name)}
            onClick={() =>
              funcUpdateFile(files.filter((obj) => obj.name !== el.name))
            }
          >
            <p>{el.name}</p>
            <span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <line
                  x1="0.353553"
                  y1="0.646508"
                  x2="8.83883"
                  y2="9.13179"
                  stroke="white"
                />
                <line
                  x1="0.646447"
                  y1="9.13174"
                  x2="9.13173"
                  y2="0.646456"
                  stroke="white"
                />
              </svg>
            </span>
          </div>
        ))}
      </div>
      <div className="btn-clear-files" onClick={() => funcUpdateFile([])}>
        <svg
          width="24"
          height="23"
          viewBox="0 0 24 23"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="1.35355"
            y1="0.646447"
            x2="23.3536"
            y2="22.6464"
            stroke="white"
          />
          <line
            x1="0.646447"
            y1="22.6464"
            x2="22.6464"
            y2="0.646451"
            stroke="white"
          />
        </svg>
      </div>
    </div>
  );
}
