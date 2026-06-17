# SAMA UI KIT

A UI component library for building SAMA chat interfaces in Web applications.

Primitives provide the visual building blocks, composables assemble them into full UI sections, and adapters wire them to your backend and state without tying the UI-kit to a specific client. The library includes reusable React components (avatars, typing indicators, video/image views, scrollbars, loaders, and more) optimized for chat UIs.

## Architecture

The UI-kit is organized into three layers: **primitive components**, **composables**, and **adapters**.

### Primitive components (elements)

Low-level UI building blocks with minimal logic. They receive data via props and are responsible for rendering and accessibility.

- **Examples:** `UserAvatar`, `TypingLine`, `VideoView`, `ImageView`, `Modal`, `DotsLoader`, `OvalLoader`, `TextAreaInput`, `SearchInput`, `SocketConnectingLine`, `MessageStatus`, `InformativeMessage`, and others.
- Located in `src/components/elements/`.
- Some primitives may use adapters for formatting (e.g. user names, timestamps); others rely only on props.

### Composables (composites)

Higher-level components built from primitives and other elements. They implement ready-made UI blocks (chat header, conversation list, search, profile, etc.) and typically use adapters to access data and trigger actions.

- **Examples:** `ConversationHeader`, `ConversationInput`, `ConversationItemList`, `SearchBlock`, `EditModalContainer`, `UserProfile`, `ChatMessage`, `AttachModal`, `ContextMenu`, and others.
- Located in `src/components/composites/`.
- Composables call `getAdapters()` and use adapter hooks and utilities (participants, conversations, messages, context menu, formatting).

### Adapters

Adapters provide **dependency injection**: the UI-kit does not depend on a specific client (SAMA or otherwise). The application configures adapters once via `setAdapters()`; components obtain them via `getAdapters()`.

- **What is provided:** hooks (`useParticipants`, `useConversations`, `useMessages`, `useDrafts`, `useContextMenu`) and utilities (`userUtils`, `conversationUtils`, `mediaUtils`, `formatedUtils`). Optionally, `getSearchBlockData` for `SearchBlock`.
- **Where it’s defined:** types in `src/adapters/types.ts`, default implementations in `src/adapters/defaults.ts`, registration via `setAdapters` / `getAdapters` in `src/adapters/manager.ts`.
- **How to use:** at application startup, call `setAdapters({ useParticipants: () => {...}, userUtils: {...}, ... })` with your implementations; UI-kit components call `getAdapters()` internally.

## API documentation

...

## Installation

```sh
npm install @sama-communications/ui-kit
```

## Usage

```js
import { TypingLine, UserAvatar, VideoView } from "@sama-communications/ui-kit";

function ChatExample() {
  return (
    <div>
      <TypingLine userIds={["user1", "user2"]} />
      <UserAvatar avatarUrl="https://example.com/avatar.jpg" />
      <VideoView video={{ file_url: "https://example.com/video.mp4" }} />
    </div>
  );
}
```

## Have an issue?

Join our [Discord](https://discord.gg/ye68KMgA2f) for quick answers to your questions or write your question in the [issues](https://github.com/SAMA-Communications/sama-client/issues) tab

## Community and support

Join our community for support and discussions:

- [GitHub Issues - SAMA server](https://github.com/SAMA-Communications/sama-server/issues), [GitHub Issues - SAMA client](https://github.com/SAMA-Communications/sama-client/issues)
- [SAMA on Medium](https://medium.com/sama-communications)
- Get help - [Discord 💬](https://discord.gg/ye68KMgA2f)

## License

[Apache 2.0](https://github.com/SAMA-Communications/sama-client/blob/main/packages/ui-kit/LICENSE)

## Changelog

[CHANGELOG](https://github.com/SAMA-Communications/sama-client/blob/main/packages/ui-kit/CHANGELOG.md)
