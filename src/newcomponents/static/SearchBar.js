import "@newstyles/static/SearchBar.css";

import { ReactComponent as Search } from "@newicons/Search.svg";

export default function SearchInput({ text }) {
  return (
    <div className="searchbar">
      <Search className="searchbar__icon" />
      <input className="searchbar__input" placeholder={text} />
    </div>
  );
}
