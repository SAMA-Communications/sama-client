import { useEffect, useState } from "react";

export const useContextMenu = () => {
  const [clicked, setClicked] = useState(false);
  const [coords, setCoords] = useState({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleClick = () => {
      setClicked(false);
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return {
    clicked,
    setClicked,
    coords,
    setCoords,
  };
};
