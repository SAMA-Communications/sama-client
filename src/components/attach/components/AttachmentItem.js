import OvalLoader from "@src/components/_helpers/OvalLoader";
import { Blurhash } from "react-blurhash";
import { useMemo } from "react";

import "@styles/attach/AttachmentItem.css";

import { ReactComponent as CloseIcon } from "@icons/actions/CloseGray.svg";

export default function AttachmentItem({
  url,
  localUrl,
  blurHash,
  name,
  size,
  removeFileFunc,
  onClickfunc,
}) {
  const pictureView = useMemo(() => {
    if (url) {
      return <img src={url} alt={name} />;
    }

    return localUrl ? (
      <img src={localUrl} alt={name} />
    ) : (
      <div className="blur-hash-preloader">
        <Blurhash
          className="canvas-preloader"
          hash={blurHash || "LEHLk~WB2yk8pyo0adR*.7kCMdnj"}
          width={70}
          height={70}
          resolutionX={32}
          resolutionY={32}
        />
        <OvalLoader height={50} width={50} />
      </div>
    );
  }, [blurHash, localUrl, name, url]);

  return (
    <div className="att-item__container" onClick={onClickfunc}>
      <div className="att-item__photo fcc">{pictureView}</div>
      <div className="att-item__content">
        <p className="att-item__name">{name || "Undefined"}</p>
        <p className="att-item__size">{size} MB</p>
      </div>
      {removeFileFunc ? (
        <CloseIcon className="att-item__remove" onClick={removeFileFunc} />
      ) : null}
    </div>
  );
}
