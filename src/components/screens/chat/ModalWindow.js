import DownloadManager from "../../../adapters/downloadManager";
import getPrevPage from "../../../utils/get_prev_page";
import { useEffect, useMemo, useState } from "react";
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

  const fileObjectView = useMemo(() => {
    if (!fileParams.url) {
      return null;
    }

    return fileParams.name?.includes(".mp4") ? (
      <video controls src={fileParams.url} poster={fileParams.name} />
    ) : (
      <img src={fileParams.url} alt={fileParams.name} />
    );
  }, [fileParams]);

  return (
    <div className="modal-window" onClick={closeWindow}>
      {fileObjectView}
    </div>
  );
}
