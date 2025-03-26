import { useEffect, useRef } from "react";

export const useTouchScreen = (callbacks) => {
  const callbackRef = useRef(callbacks);

  const minDistance = 100;

  useEffect(() => {
    callbackRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    let startCoords = { x: null, y: null };

    const handleTouchStart = (e) => {
      const { clientX, clientY } = e.touches[0];
      startCoords = { x: clientX, y: clientY };
    };

    const handleTouchMove = (e) => {
      if (startCoords.x === null || startCoords.y === null) return;

      const { clientX: xUp, clientY: yUp } = e.touches[0];
      const xDiff = startCoords.x - xUp;
      const yDiff = startCoords.y - yUp;

      const isHorizontal = Math.abs(xDiff) > Math.abs(yDiff);
      const swipeDistance = Math.max(Math.abs(xDiff), Math.abs(yDiff));

      if (swipeDistance > minDistance) {
        if (isHorizontal) {
          xDiff > 0
            ? callbackRef.current.right?.()
            : callbackRef.current.left?.();
        } else {
          yDiff > 0 ? callbackRef.current.down?.() : callbackRef.current.up?.();
        }

        startCoords = { x: null, y: null };
      }
    };

    document.addEventListener("touchstart", handleTouchStart, false);
    document.addEventListener("touchmove", handleTouchMove, false);
    return () => {
      document.removeEventListener("touchstart", handleTouchStart, false);
      document.removeEventListener("touchmove", handleTouchMove, false);
    };
  }, []);
};
