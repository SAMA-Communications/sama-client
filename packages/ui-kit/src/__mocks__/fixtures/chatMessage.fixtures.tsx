/**
 * Small re-exports and JSX slots for `ChatMessage` tests (keeps the main test file lean).
 */
import { chatMessageMessagesMock } from "../messages.mock";
import { participantsMock } from "../participants.mock";

export { chatMessageMessagesMock, participantsMock };

export const attachmentsSlot = <div data-testid="attachments-slot">Attachments</div>;
export const linkPreviewSlot = <div data-testid="link-preview-slot">Link preview</div>;
