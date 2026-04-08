import { vi } from "vitest";

import type { ChatNameInputProps } from "../../components/composites/ChatNameInput/ChatNameInput.types";

/** Shared `vi.fn()` handlers for `ChatNameInput` interaction tests. */
export function createChatNameInputHandlers(): Pick<
  ChatNameInputProps,
  "onConfirm" | "onCancel" | "onValidationError"
> {
  return {
    onConfirm: vi.fn(),
    onCancel: vi.fn(),
    onValidationError: vi.fn(),
  };
}
