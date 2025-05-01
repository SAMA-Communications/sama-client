import { useSelector } from "react-redux";
import { useState } from "react";
import { AnimatePresence, motion as m } from "framer-motion";

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
      <m.section
        className={`flex flex-1 flex-col gap-[20px] md:my-[30px] md:mr-[30px] md:py-[60px] items-center justify-center rounded-[48px] bg-(--color-bg-light) max-md:w-full max-md:h-[calc(100dvh-60px)] max-md:mt-[60px] max-md:pt-[15px] max-md:rounded-b-[0] max-md:rounded-t-[16px]`}
      >
        <AnimatePresence>
          {inputText ? null : (
            <m.div
              key="emptyHubText"
              className={`overflow-hidden`}
              initial={{ height: 0, opacity: 1, marginBottom: -20 }}
              animate={{
                opacity: 1,
                height: 107,
                marginBottom: 0,
                transition: { delay: 0.6 },
              }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-[20px] text-center text-[58px] max-xl:text-h1">
                You don't have any chats yet.
              </p>
            </m.div>
          )}
          <SearchInput
            customLastClassName="max-md:w-full"
            shadowText={"Search"}
            setState={setInputText}
            isLargeSize={true}
          />
          {inputText && (
            <SearchBlock
              key="emptyHubInput"
              customClassName="w-[400px]"
              searchText={inputText}
              isPreviewUserProfile={true}
              isSearchOnlyUsers={true}
            />
          )}
        </AnimatePresence>
      </m.section>
    </>
  );
}
