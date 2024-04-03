export default function VideoView({ url, posterName }) {
  return (
    <video
      controls
      autoPlay="autoplay"
      src={url + "#t=0.1"}
      poster={posterName}
    />
  );
}
