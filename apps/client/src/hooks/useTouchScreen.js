import { useEffect, useRef } from "react";

export const useTouchScreen = (
  targetRef,
  callbacks,
  minDistances = { x: 100, y: 50 }
) => {
  const callbackRef = useRef(callbacks);

  useEffect(() => {
    callbackRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    let startCoords = { x: null, y: null };

    const handleTouchStart = (e) => {
      if (targetRef.current && !targetRef.current.contains(e.target)) return;

      const { clientX, clientY } = e.touches[0];
      startCoords = { x: clientX, y: clientY };
    };

    const handleTouchMove = (e) => {
      if (startCoords.x === null || startCoords.y === null) return;

      const { clientX: xUp, clientY: yUp } = e.touches[0];
      const xDiff = startCoords.x - xUp;
      const yDiff = startCoords.y - yUp;

      const isHorizontal = Math.abs(xDiff) > Math.abs(yDiff);
      const swipeDistance = isHorizontal ? Math.abs(xDiff) : Math.abs(yDiff);

      if (
        (isHorizontal && swipeDistance > minDistances.x) ||
        (!isHorizontal && swipeDistance > minDistances.y)
      ) {
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
  }, [targetRef, minDistances]);
};
