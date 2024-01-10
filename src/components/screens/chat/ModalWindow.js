import DownloadManager from "@adapters/downloadManager";
import getFileType from "@utils/get_file_type";
import getPrevPage from "@utils/get_prev_page";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ModalWindow() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  const [fileParams, setFileParams] = useState({});

  const closeWindow = () => navigate(getPrevPage(hash));

  window.onkeydown = function (event) {
    event.keyCode === 27 && closeWindow();
  };

  useEffect(() => {
    const fileId = hash
      .split("?")
      .splice(-1, 1)[0]
      .slice(3)
      .replaceAll("%", " ");

    DownloadManager.getDownloadFileLinks({
      [fileId]: {
        _id: fileId,
        file_name: fileId,
        file_id: fileId,
      },
    }).then((res) => {
      const { file_url, file_name } = res[0].attachments[0];
      setFileParams({ url: file_url, name: file_name });
    });
  }, [hash]);

  return (
    <div className="modal-window" onClick={closeWindow}>
      {getFileType(fileParams.name) === "Video" ? (
        <video
          autoPlay
          controls
          src={fileParams.url + "#t=0.1"}
          poster={fileParams.name}
          onClick={(event) => event.stopPropagation()}
        />
      ) : (
        <img src={fileParams.url} alt={fileParams.name} />
      )}
    </div>
  );
}
