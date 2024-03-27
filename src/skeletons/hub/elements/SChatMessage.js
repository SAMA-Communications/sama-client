import Skeleton from "react-loading-skeleton";

export default function SChatMessage() {
  return (
    <div className="message__container">
      <div className="message-photo">
        <Skeleton height={46} width={46} />
      </div>
      <div className="message-content__container--skeleton">
        {/* <CornerLight className="message-content--corner" /> */}
        <Skeleton
          height={122}
          width={Math.floor(Math.random() * (351 - 200) + 250)}
        />
      </div>
    </div>
  );
}
