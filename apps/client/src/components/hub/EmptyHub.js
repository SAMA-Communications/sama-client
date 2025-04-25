import { useSelector } from "react-redux";
import { useState } from "react";

import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchBar";
import MenuButtons from "../info/elements/MenuButtons.js";

import { getIsMobileView } from "@store/values/IsMobileView";

export default function EmptyHub() {
  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);

  return (
    <>
      {isMobileView ? <MenuButtons /> : null}
      <section
        className={`flex flex-1 flex-col gap-[20px] md:my-[30px] md:mr-[30px] md:py-[60px] items-center rounded-[48px] bg-(--color-bg-light) ${
          inputText ? "justify-start" : "justify-center"
        } max-md:w-full max-md:h-[calc(100dvh-60px)] max-md:mt-[60px] max-md:pt-[15px] max-md:rounded-b-[0] max-md:rounded-t-[16px]`}
      >
        <div className={`overflow-hidden ${inputText ? "hidden" : "block"}`}>
          <p className="mb-[20px] text-center text-[58px] max-xl:text-h1">
            You don't have any chats yet.
          </p>
        </div>
        <SearchInput
          customLastClassName="max-md:w-full"
          shadowText={"Search"}
          setState={setInputText}
          isLargeSize={true}
        />
        <SearchBlock
          customClassName="w-[400px]"
          searchText={inputText}
          isPreviewUserProfile={true}
          isSearchOnlyUsers={true}
        />
      </section>
    </>
  );
}
