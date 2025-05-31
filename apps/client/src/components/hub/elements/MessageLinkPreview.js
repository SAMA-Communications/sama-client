export default function MessageLinkPreview({ urlData, color }) {
  if (!urlData) return null;
  const { url, title, siteName, description, images, favicons } = urlData;
  // console.log(urlData);

  if (!description && (!images || images.length === 0)) return null;

  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div
        className={`flex flex-col p-[10px] mt-[5px] ${
          color === "white"
            ? "bg-(--color-accent-light)/20"
            : "bg-(--color-hover-dark)/5"
        } rounded-lg`}
      >
        <div className="flex flex-row gap-[5px] items-center">
          {favicons?.length > 0 && (
            <img
              src={favicons[0]}
              alt="Preview"
              className="w-[10px] h-[10px] object-contain rounded-md"
            />
          )}
          <div className="flex flex-col flex-1">
            {siteName && (
              <p className="!font-normal line-clamp-1 overflow-hidden text-ellipsis">
                {siteName}
              </p>
            )}
            <p className="!font-normal line-clamp-1 overflow-hidden text-ellipsis">
              {title}
            </p>
          </div>
        </div>
        {description && (
          <p className="line-clamp-2 overflow-hidden text-ellipsis mt-[2px]">
            {description}
          </p>
        )}
        {images?.length > 0 && (
          <img
            src={images[0]}
            alt="Preview"
            className="w-full max-h-[300px] h-full object-contain rounded-md mt-[4px]"
          />
        )}
      </div>
    </a>
  );
}
