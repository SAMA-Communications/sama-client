import SChatMessage from "./SChatMessage";

export default function SMessageList() {
  return (
    <div className="infinite-scroll-component__outerdiv">
      <div
        className="infinite-scroll-component "
        style={{ height: "auto", overflow: "auto" }}
      >
        <SChatMessage />
        <SChatMessage />
        <SChatMessage />
        <SChatMessage />
        <SChatMessage />
        <SChatMessage />
      </div>
    </div>
  );
}
