import { useEffect, useRef } from "react";

type KeyDownCallback = (event: KeyboardEvent) => void;

export const useKeyDown = (key: string | number, callback: any): void => {
  const callbackRef = useRef<KeyDownCallback>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (event.key === key) {
        callbackRef.current(event);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key]);
};
