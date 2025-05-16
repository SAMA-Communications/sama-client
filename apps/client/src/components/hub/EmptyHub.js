import * as m from "motion/react-m";
import { AnimatePresence } from "motion/react";
import { useSelector } from "react-redux";
import { useState } from "react";

import SearchBlock from "@components/search/SearchBlock";
import SearchInput from "@components/static/SearchInput";
import MenuButtons from "../info/elements/MenuButtons.js";

import { getIsMobileView } from "@store/values/IsMobileView";
import { getIsTabletView } from "@store/values/IsTabletView.js";

export default function EmptyHub() {
  const [inputText, setInputText] = useState(null);

  const isMobileView = useSelector(getIsMobileView);
  const isTabletView = useSelector(getIsTabletView);

  return (
    <>
      {isMobileView ? <MenuButtons /> : null}
      <m.div
        className={`flex flex-1 flex-col gap-[20px] items-center justify-center rounded-[48px] max-md:w-full max-md:mt-[35px] max-md:rounded-[0]`}
      >
        <AnimatePresence>
          {inputText ? null : (
            <m.div
              key="emptyHubText"
              className={`overflow-hidden`}
              initial={{ height: 0, marginBottom: -40 }}
              animate={{
                height:
                  isTabletView || isMobileView ? (isMobileView ? 42 : 66) : 107,
                marginBottom: 0,
                transition: { delay: 0.6 },
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-[20px] text-center text-[58px] max-xl:text-[44px] max-md:text-h4">
                You don't have any chats yet.
              </p>
            </m.div>
          )}
        </AnimatePresence>
        <SearchInput
          customClassName="max-md:w-full"
          shadowText={"Search"}
          setState={setInputText}
          disableAnimation={false}
          isLargeSize={true}
        />
        <AnimatePresence>
          {inputText && (
            <SearchBlock
              key="emptyHubInput"
              customClassName="w-[400px] md:max-xl:!w-[400px]"
              searchText={inputText}
              isPreviewUserProfile={true}
              isSearchOnlyUsers={true}
            />
          )}
        </AnimatePresence>
      </m.div>
    </>
  );
}
