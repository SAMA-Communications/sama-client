import SearchInput from "@components/static/SearchBar";

import "../../newstyles/hub/EmptyHub.css";

export default function EmptyHub() {
  return (
    <section className="hub--empty fcc">
      <p className="hub__title">You don't have any created chats.</p>
      <SearchInput text={"Search"} />
    </section>
  );
}
