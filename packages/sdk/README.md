# SAMA SDK

A client SDK for interacting with the SAMA chat application.

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
```
