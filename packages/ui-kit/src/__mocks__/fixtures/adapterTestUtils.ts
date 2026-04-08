import type { Conversation } from "types/samaWssModels";

import { getAdapters, setAdapters } from "@adapters";

/**
 * Baseline `useConversations` implementation from the Vitest adapter mock.
 * Captured once when this module loads so tests can restore it after overrides.
 */
export const baselineUseConversations = getAdapters().useConversations;

/** Restores `useConversations` to the baseline mock (undoes `overrideSelectedConversation`). */
export function resetUseConversationsAdapter() {
  setAdapters({ useConversations: baselineUseConversations });
}

/**
 * Merges a custom `getSelectedConversation` into the baseline conversations mock.
 * All other hook methods keep their baseline behavior.
 */
export function overrideSelectedConversation(getSelectedConversation: () => Conversation) {
  const inner = baselineUseConversations();
  setAdapters({
    useConversations: () => ({
      ...inner,
      getSelectedConversation,
    }),
  });
}
