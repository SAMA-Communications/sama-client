import type { Conversation } from "../types/samaWssModels";

const ORG_ID = "68275e45d713217b53da5e35";
const UPDATED_AT = "2025-01-10T12:00:00.000Z";
const CREATED_AT = "2025-01-01T00:00:00.000Z";

/**
 * Sample conversation list for tests that need multiple rows.
 * For single, fully-typed fixtures, prefer `minimalDirectConversation` / `minimalGroupConversation`
 * in `fixtures/conversation.fixtures.ts`.
 */
export const conversationsMock: Conversation[] = [
  {
    _id: "c1",
    organization_id: ORG_ID,
    type: "u",
    name: "",
    owner_id: "u1",
    opponent_id: "u2",
    typing_users: [],
    draft: null,
    image_url: "",
    last_message: null,
    unread_messages_count: 0,
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,
  },
  {
    _id: "c2",
    organization_id: ORG_ID,
    type: "u",
    name: "",
    owner_id: "u3",
    opponent_id: "u5",
    typing_users: ["u3"],
    draft: { text: "draft message", replied_mid: null },
    image_url: "",
    last_message: null,
    unread_messages_count: 2,
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,
  },
  {
    _id: "c3",
    organization_id: ORG_ID,
    type: "g",
    name: "Developers",
    owner_id: "u1",
    typing_users: [],
    draft: null,
    image_url: "",
    last_message: null,
    unread_messages_count: 5,
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,
  },
  {
    _id: "c4",
    organization_id: ORG_ID,
    type: "u",
    name: "Bob Chat",
    owner_id: "u2",
    opponent_id: "u1",
    typing_users: ["u2"],
    draft: null,
    image_url: "",
    last_message: null,
    unread_messages_count: 0,
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,
  },
  {
    _id: "c5",
    organization_id: ORG_ID,
    type: "g",
    name: "",
    owner_id: "u3",
    typing_users: [],
    draft: null,
    image_url: "",
    last_message: null,
    unread_messages_count: 1,
    created_at: CREATED_AT,
    updated_at: UPDATED_AT,
  },
];
