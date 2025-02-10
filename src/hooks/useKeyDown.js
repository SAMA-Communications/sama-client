import { useEffect, useRef } from "react";

const activeKeyHandlers = new Map();

const globalHandler = (event) => {
  const stack = activeKeyHandlers.get(event.keyCode);
  if (stack?.length) {
    stack[stack.length - 1].callbackRef.current(event);
  }
};

if (typeof window !== "undefined" && !window.__hasGlobalKeyDownListener) {
  window.addEventListener("keydown", globalHandler);
  window.__hasGlobalKeyDownListener = true;
}

export const useKeyDown = (keyCode, callback) => {
  const callbackRef = useRef(callback);
  const keyRef = useRef(Symbol());

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!activeKeyHandlers.has(keyCode)) {
      activeKeyHandlers.set(keyCode, []);
    }

    const stack = activeKeyHandlers.get(keyCode);

    if (stack.some((entry) => entry.keyRef === keyRef.current)) {
      return;
    }

    stack.push({ callbackRef, keyRef: keyRef.current });

    return () => {
      const stack = activeKeyHandlers.get(keyCode);
      if (!stack) return;
      const index = stack.findIndex((entry) => entry.keyRef === keyRef.current);
      if (index !== -1) {
        stack.splice(index, 1);
      }

      if (stack.length === 0) {
        activeKeyHandlers.delete(keyCode);
      }
    };
  }, [keyCode]);
};
