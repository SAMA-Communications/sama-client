# SAMA UI KIT

A UI component library for building SAMA chat interfaces in Web applications.

This library provides reusable React components such as avatars, typing indicators, video/image views, scrollbars, loaders, and more, optimized for chat UIs.

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
