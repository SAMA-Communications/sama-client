import NavigationLine from "@components/navigation/NavigationLine";
import SHub from "@skeletons/hub/SHub";

export default function SMain({ isReverseAnimation, setAnimateMainPage }) {
  return (
    <>
      <NavigationLine isReverse={isReverseAnimation} />
      <SHub
        isReverse={isReverseAnimation}
        animateOptions={setAnimateMainPage}
      />
    </>
  );
}
