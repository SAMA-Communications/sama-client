# SAMA SDK

A SDK client for interacting with the SAMA chat server from Web/Node.js apps

## Demo

<img width="1282" alt="ClientImage" src="https://github.com/SAMA-Communications/sama-client/assets/98953475/fe8dfd1c-462d-46d2-aa24-5792b36e23f2">

This is a demo app to test all these methods https://app.samacloud.io/demo

## API documentation

See all available methods [api/api.ts](https://github.com/SAMA-Communications/sama-client/blob/main/packages/sdk/src/api/api.ts)

## Installation

```sh
npm install @sama-communications/sdk
```

## Usage

```js
import { SAMAClient } from "@sama-communications/sdk";

const config = {
  endpoint: {
    ws: "wss://your-websocket-url"
    http: "https://your-websocket-url.com"
  }
}

const client = new SAMAClient(config);

client
  .connect()
  .then(() => {
    console.log("Connected to the server");
  })
  .catch((error) => {
    console.error("Failed to connect to the server:", error);
  });

client
  .userLogin({ login: "user_login", password: "user_password" })
  .then((response) => {
    console.log("User logged in:", response);
  })
  .catch((error) => {
    console.error("Failed to log in:", error);
  });

  ...
```

## Have an issue?

Join our [Discord](https://discord.gg/ye68KMgA2f) for quick answers to your questions or write your question in the [issues](https://github.com/SAMA-Communications/sama-client/issues) tab

## Community and support

Join our community for support and discussions:

- [GitHub Issues - SAMA server](https://github.com/SAMA-Communications/sama-server/issues), [GitHub Issues - SAMA client](https://github.com/SAMA-Communications/sama-client/issues)
- [SAMA on Medium](https://medium.com/sama-communications)
- Get help - [Discord 💬](https://discord.gg/ye68KMgA2f)

## License

[Apache 2.0](https://github.com/SAMA-Communications/sama-client/blob/main/packages/sdk/LICENSE)

## Changelog

[CHANGELOG](https://github.com/SAMA-Communications/sama-client/blob/main/packages/sdk/CHANGELOG.md)
