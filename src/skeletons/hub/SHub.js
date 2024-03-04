import CustomScrollBar from "@newcomponents/_helpers/CustomScrollBar";
import SearchInput from "@newcomponents/static/SearchBar";
import SChatList from "./SChatList";

export default function SHub() {
  return (
    <section className="hub">
      <div className="chat-list__container">
        <SearchInput shadowText={"Search"} />
        <CustomScrollBar>
          <SChatList />
        </CustomScrollBar>
      </div>
    </section>
  );
}
