import DownloadManager from "../../../adapters/downloadManager";
import getPrevPage from "../../../utils/get_prev_page";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function ModalWindow() {
  const navigate = useNavigate();
  const { hash } = useLocation();

  const [fileParams, setFileParams] = useState({});
  const [videoCurrentTime, setVideoCurrentTime] = useState(0);

  const videoElRef = useRef(null);

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

      const currentTimeVideo = localStorage.getItem("currentTimeVideo");
      if (currentTimeVideo) {
        localStorage.removeItem("currentTimeVideo");
        setVideoCurrentTime(currentTimeVideo);
      }
    });
  }, [hash]);

  return (
    <div className="modal-window" onClick={closeWindow}>
      {fileParams.name?.includes(".mp4") ? (
        <video
          ref={videoElRef}
          onLoadedData={() =>
            (videoElRef.current.currentTime = videoCurrentTime)
          }
          autoPlay
          controls
          src={fileParams.url}
          poster={fileParams.name}
        />
      ) : (
        <img src={fileParams.url} alt={fileParams.name} />
      )}
    </div>
  );
}
