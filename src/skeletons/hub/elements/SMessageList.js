import SChatMessage from "@skeletons/hub/elements/SChatMessage";

export default function SMessageList() {
  return (
    <div className="infinite-scroll-component__outerdiv">
      <div
        className="infinite-scroll-component"
        id="1"
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
