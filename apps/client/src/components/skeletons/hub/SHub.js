import { motion as m } from "framer-motion";

import CustomScrollBar from "@components/_helpers/CustomScrollBar";
import SearchInput from "@components/static/SearchBar";

import SChatList from "@skeletons/hub/SChatList";

export default function SHub() {
  return (
    <m.section
      className="p-[30px] md:mr-[20px] md:my-[20px]  flex flex-1 flex-row gap-[15px] md:rounded-[48px] bg-(--color-bg-light)"
      initial={{ opacity: 0 }}
      animate={{ scale: [0.8, 1.02, 1], opacity: [0, 1] }}
      transition={{ duration: 0.8 }}
    >
      <div className="w-[400px] mt-[5px] flex gap-[10px] flex-col justify-start items-center max-md:w-full max-xl:w-full max-xl:flex-1">
        <SearchInput shadowText={"Search"} />
        <CustomScrollBar>
          <SChatList />
        </CustomScrollBar>
      </div>
    </m.section>
  );
}
