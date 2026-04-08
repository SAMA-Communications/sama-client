import type { MessageAttachment } from "../types/samaWssModels";
import type { ChatMessageMessage } from "../components/composites/ChatMessage/ChatMessage.types";

import { attachmentsMock } from "./attachments.mock";

const ORG_ID = "68275e45d713217b53da5e35";
const baseTime = Math.floor(Date.now() / 1000);
const isoBase = "2025-01-01T12:00:00.000Z";

/**
 * Generic `Message`-shaped rows (includes `replied_mid` where relevant).
 * Prefer `chatMessageMessagesMock` for `ChatMessage` component tests.
 */
export const messagesMock = [
  {
    _id: "m1",
    organization_id: ORG_ID,
    cid: "c1",
    from: "u1",
    body: "Hello!",
    attachments: [] as MessageAttachment[],
    status: "sent",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
    replied_mid: null,
  },
  {
    _id: "m2",
    organization_id: ORG_ID,
    cid: "c1",
    from: "u2",
    body: "",
    attachments: [attachmentsMock[0] as unknown as MessageAttachment],
    status: "read",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
    replied_mid: null,
  },
  {
    _id: "m3",
    organization_id: ORG_ID,
    cid: "c2",
    from: "u3",
    body: "PDF attached",
    attachments: [attachmentsMock[2] as unknown as MessageAttachment],
    status: "sent",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
    replied_mid: null,
  },
  {
    _id: "m4",
    organization_id: ORG_ID,
    cid: "c3",
    from: "u4",
    body: "",
    attachments: [attachmentsMock[1] as unknown as MessageAttachment],
    status: "sent",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
    replied_mid: "m3",
  },
  {
    _id: "m5",
    organization_id: ORG_ID,
    cid: "c2",
    from: "u5",
    body: "Another image",
    attachments: [attachmentsMock[4] as unknown as MessageAttachment],
    status: "read",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
    replied_mid: null,
  },
];

/** Messages tailored to `ChatMessage` tests (forwarded, edited, attachment variants). */
export const chatMessageMessagesMock: ChatMessageMessage[] = [
  {
    _id: "m1",
    cid: "c1",
    from: "u1",
    body: "Hello!",
    attachments: [],
    status: "sent",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
  },
  {
    _id: "m2",
    cid: "c1",
    from: "u2",
    body: "",
    attachments: [attachmentsMock[0] as unknown as MessageAttachment],
    status: "read",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
  },
  {
    _id: "m3",
    cid: "c2",
    from: "u3",
    body: "PDF attached",
    attachments: [attachmentsMock[2] as unknown as MessageAttachment],
    status: "sent",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
  },
  {
    _id: "m-forwarded",
    cid: "c1",
    from: "u1",
    body: "Forwarded text",
    attachments: [],
    status: "sent",
    t: baseTime,
    created_at: isoBase,
    updated_at: isoBase,
    forwarded_message_id: "other-msg-id",
  },
  {
    _id: "m-edited",
    cid: "c1",
    from: "u1",
    body: "Hello world",
    attachments: [],
    status: "sent",
    t: baseTime,
    created_at: "2025-01-01T12:00:00.000Z",
    updated_at: "2025-01-01T12:05:00.000Z",
  },
];
