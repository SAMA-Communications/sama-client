import { SamaAdapters } from "./types";
import { defaultAdapters } from "./defaults";

let currentAdapters: SamaAdapters = { ...defaultAdapters };

export function setAdapters(newAdapters: Partial<SamaAdapters>) {
  currentAdapters = deepMerge(currentAdapters, newAdapters);
}

export function getAdapters(): SamaAdapters {
  return currentAdapters;
}

function deepMerge<T extends object, U extends object>(target: T, source: U): T & U {
  const output = { ...target } as T & U;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const sourceValue = (source as any)[key];
      const targetValue = (target as any)[key];

      if (Array.isArray(sourceValue)) {
        (output as any)[key] = Array.isArray(targetValue) ? [...targetValue, ...sourceValue] : [...sourceValue];
      } else if (isObject(sourceValue)) {
        (output as any)[key] = isObject(targetValue) ? deepMerge(targetValue, sourceValue) : sourceValue;
      } else {
        (output as any)[key] = sourceValue;
      }
    });
  }

  return output;
}

function isObject(item: any): item is Record<string, any> {
  return item && typeof item === "object" && !Array.isArray(item);
}
