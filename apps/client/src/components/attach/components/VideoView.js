import PlayButton from "@components/_helpers/PlayButton.js";

export default function VideoView({
  video,
  onClickFunc,
  isFullSize = true,
  removePlayButton = false,
  enableControls = false,
}) {
  const { file_name, file_url } = video || {};

  return (
    <>
      <video
        className={`${
          isFullSize ? "w-full h-full" : "max-w-full max-h-full"
        } object-cover`}
        controls={enableControls}
        autoPlay={enableControls ? "autoplay" : false}
        src={file_url + "#t=0.1"}
        poster={file_name}
        onClick={onClickFunc}
      />
      {enableControls || removePlayButton ? null : (
        <PlayButton onClickFunc={onClickFunc} />
      )}
    </>
  );
}
