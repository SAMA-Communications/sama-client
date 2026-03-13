import { useEffect, useRef, useCallback } from "react";

type KeyDownCallback = (event: KeyboardEvent) => void;

let nextEventId = 0;
const processedEventIds = new Set<number>();

function matchKey(event: KeyboardEvent, key: string | number): boolean {
  if (typeof key === "number") {
    return event.keyCode === key;
  }
  return event.key === key;
}

export type UseKeyDownOptions = {
  /**
   * When true (default), the last queued event is processed automatically on each keydown.
   * When false, you must call processLast() explicitly (e.g. from a button click).
   */
  processOnKeyDown?: boolean;
};

export type UseKeyDownResult = {
  /** Run the callback with the last queued key event, if any. Deduplicated across instances. */
  processLast: () => void;
};

export const useKeyDown = (
  key: string | number,
  callback: KeyDownCallback,
  options: UseKeyDownOptions = {},
): UseKeyDownResult => {
  const { processOnKeyDown = true } = options;
  const callbackRef = useRef<KeyDownCallback>(callback);
  const queueRef = useRef<Array<{ id: number; event: KeyboardEvent }>>([]);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const processLast = useCallback((): void => {
    const queue = queueRef.current;
    if (queue.length === 0) return;

    const entry = queue[queue.length - 1];
    if (processedEventIds.has(entry.id)) {
      queue.pop();
      return;
    }

    processedEventIds.add(entry.id);
    queue.pop();
    callbackRef.current(entry.event);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent): void => {
      if (!matchKey(event, key)) return;

      const id = ++nextEventId;
      queueRef.current.push({ id, event });

      if (processOnKeyDown) {
        processLast();
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [key, processOnKeyDown, processLast]);

  return { processLast };
};
