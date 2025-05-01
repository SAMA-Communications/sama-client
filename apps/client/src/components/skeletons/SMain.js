import { useSelector } from "react-redux";

import NavigationLine from "@components/navigation/NavigationLine";

import { getIsMobileView } from "@store/values/IsMobileView.js";

import SHub from "@skeletons/hub/SHub";

export default function SMain({ setAnimateMainPage }) {
  const isMobileView = useSelector(getIsMobileView);

  return (
    <div className="w-dvw h-dvh flex overflow-hidden">
      {isMobileView ? null : <NavigationLine />}
      <SHub animateOptions={setAnimateMainPage} />
    </div>
  );
}
