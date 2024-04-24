import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import SearchInput from "@components/static/SearchBar";
import SChatList from "@skeletons/hub/SChatList";

import "@styles/hub/ChatList.css";

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
