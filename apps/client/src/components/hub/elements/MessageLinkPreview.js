export default function MessageLinkPreview({ urlData, color }) {
  if (!urlData) return null;
  const { url, title, siteName, description, images } = urlData;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div
        className={`flex flex-col p-[10px] mt-[5px] ${
          color === "white"
            ? "bg-(--color-accent-light)/20"
            : "bg-(--color-hover-dark)/5"
        } rounded-lg`}
      >
        <p className="!font-normal line-clamp-2 overflow-hidden text-ellipsis">
          {siteName}
        </p>
        <p className="!font-normal line-clamp-2 overflow-hidden text-ellipsis">
          {title}
        </p>
        <p className="line-clamp-2 overflow-hidden text-ellipsis">
          {description}
        </p>
        <img
          src={images[0]}
          alt="Preview"
          className="w-full h-full object-contain rounded-md mt-[4px]"
        />
      </div>
    </a>
  );
}
