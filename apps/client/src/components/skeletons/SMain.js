import { useSelector } from "react-redux";

import NavigationLine from "@components/navigation/NavigationLine";

import { getIsMobileView } from "@store/values/IsMobileView.js";

import SHub from "@skeletons/hub/SHub";

export default function SMain({ isReverseAnimation, setAnimateMainPage }) {
  const isMobileView = useSelector(getIsMobileView);

  return (
    <>
      {isMobileView ? null : <NavigationLine isReverse={isReverseAnimation} />}
      <SHub
        isReverse={isReverseAnimation}
        animateOptions={setAnimateMainPage}
      />
    </>
  );
}
