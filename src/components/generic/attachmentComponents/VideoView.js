export default function VideoView({ vRef, url, posterName }) {
  return (
    <video
      ref={vRef}
      controls
      src={url + "#t=0.1"}
      poster={posterName}
      onClick={(event) => {
        event.preventDefault();
        vRef.current.pause();
      }}
    />
  );
}
