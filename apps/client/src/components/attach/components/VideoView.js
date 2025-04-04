export default function VideoView({ url, posterName }) {
  return (
    <video
      className="max-w-full max-h-full"
      controls
      autoPlay="autoplay"
      src={url + "#t=0.1"}
      poster={posterName}
    />
  );
}
