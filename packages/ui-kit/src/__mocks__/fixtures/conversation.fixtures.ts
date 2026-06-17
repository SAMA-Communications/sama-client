import type { Conversation } from "../../types/samaWssModels";

/** Direct (1:1) chat with a minimal `last_message` for list previews. */
export const minimalDirectConversation: Conversation = {
  _id: "conv-d1",
  organization_id: "68275e45d713217b53da5e35",
  type: "u",
  owner_id: "u1",
  opponent_id: "u2",
  draft: null,
  last_message: {
    _id: "lm1",
    from: "u2",
    body: "Hello",
    t: 1700000000,
    attachments: [],
  },
  unread_messages_count: 0,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-02T00:00:00.000Z",
};

/**
 * Group chat fixture. `opponent_id` is set so code paths that still read it on groups behave predictably in tests.
 */
export const minimalGroupConversation: Conversation = {
  _id: "conv-g1",
  organization_id: "68275e45d713217b53da5e35",
  type: "g",
  name: "Team chat",
  owner_id: "u1",
  opponent_id: "u2",
  draft: null,
  last_message: {
    _id: "lm2",
    from: "u1",
    body: "Hi all",
    t: 1700000100,
    attachments: [],
  },
  unread_messages_count: 2,
  created_at: "2025-01-01T00:00:00.000Z",
  updated_at: "2025-01-03T00:00:00.000Z",
};
