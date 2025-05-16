import SChatMessage from "@skeletons/hub/elements/SChatMessage";

export default function SMessageList() {
  return (
    <div className="infinite-scroll-component__outerdiv">
      <div className="infinite-scroll-component h-auto overflow-auto" id="1">
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
