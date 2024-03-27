export default function VideoView({ url, posterName }) {
  return (
    <video
      muted
      loop
      autoPlay="autoplay"
      src={url + "#t=0.1"}
      poster={posterName}
    />
  );
}
