import { useEffect, useRef, useId } from "react";

type KeyDownCallback = (event: KeyboardEvent) => void;

type MapKey = `n:${number}` | `s:${string}`;

type CallbackRef = { current: KeyDownCallback };

type StackEntry = { id: string; callbackRef: CallbackRef };

function matchKey(event: KeyboardEvent, key: string | number): boolean {
  if (typeof key === "number") return event.keyCode === key;
  return event.key === key;
}

function toMapKey(key: string | number): MapKey {
  return (typeof key === "number" ? `n:${key}` : `s:${key}`) as MapKey;
}

function fromMapKey(mapKey: MapKey): string | number {
  return mapKey.startsWith("n:") ? Number(mapKey.slice(2)) : mapKey.slice(2);
}

const stacks = new Map<MapKey, StackEntry[]>();

let documentListenerAttached = false;

function handleDocumentKeyDown(event: KeyboardEvent): void {
  for (const [mapKey, stack] of stacks) {
    if (stack.length === 0) continue;
    if (!matchKey(event, fromMapKey(mapKey))) continue;

    const topEntry = stack[stack.length - 1];
    topEntry.callbackRef.current(event);
    return;
  }
}

export function initDocumentKeyDown(): void {
  if (documentListenerAttached) return;
  document.addEventListener("keydown", handleDocumentKeyDown);
  documentListenerAttached = true;
}

export const useKeyDown = (key: string | number, callback: KeyDownCallback, enabled: boolean = true): void => {
  const callbackRef = useRef(callback);
  const instanceId = useId();

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) return;

    initDocumentKeyDown();

    const mapKey = toMapKey(key);
    let stackForKey = stacks.get(mapKey);
    if (!stackForKey) {
      stackForKey = [];
      stacks.set(mapKey, stackForKey);
    }
    const newEntry: StackEntry = { id: instanceId, callbackRef };
    stackForKey.push(newEntry);

    return () => {
      const stackAfterUnmount = stacks.get(mapKey);
      if (!stackAfterUnmount) return;

      const entryIndex = stackAfterUnmount.findIndex((entry) => entry.id === instanceId);
      if (entryIndex !== -1) {
        stackAfterUnmount.splice(entryIndex, 1);
      }
      if (stackAfterUnmount.length === 0) {
        stacks.delete(mapKey);
      }
    };
  }, [key, instanceId, enabled]);
};
