export default function VideoView({ url, posterName }) {
  return (
    <video
      muted
      loop
      autoplay="autoplay"
      src={url + "#t=0.1"}
      poster={posterName}
    />
  );
}
