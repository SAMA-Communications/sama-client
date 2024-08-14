# SAMA - Simple but Advanced Messaging Alternative - Client app

<img width="1282" alt="ClientImage" src="https://github.com/SAMA-Communications/sama-client/assets/98953475/fe8dfd1c-462d-46d2-aa24-5792b36e23f2">

## Overview

This is a frontend demo app for the SAMA server https://github.com/SAMA-Communications/sama-server

Read a complete medium post **Introducing SAMA** about what is SAMA and what problems we are trying to solve with it https://medium.com/sama-communications/introducing-sama-simple-but-advanced-messaging-alternative-chat-server-524a532e2040

## Public cloud

The whole SAMA stack can be tested using https://app.samacloud.io public cloud.

## Development

### To run Web

- Make sure you followed SAMA server Development guide first https://github.com/SAMA-Communications/sama-server/blob/main/README.md#development
- Copy `.env.example` to `.env`.
- Generate VAPID keys via `npx web-push generate-vapid-keys` and set Public Key to `REACT_APP_PUBLIC_VAPID_KEY` in `.env` file
- `npm install` to install dependencies
- `npm run start` to run server
- Access http://localhost:3000 in your browser

There are also other components. Make sure to check [Deploying SAMA chat server stack: a comprehensive guide](https://medium.com/sama-communications/deploying-sama-chat-server-stack-a-comprehensive-guide-294ddb9a2d78)

### To run iOS and Android

#### Preparations

- In order to develop any application with Capacitor, you will need NodeJS 18 or higher installed
- Follow https://capacitorjs.com/docs/getting-started/environment-setup#ios-requirements guide to make sure you meet iOS requirements
- Follow https://capacitorjs.com/docs/getting-started/environment-setup#android-requirements guide to make sure you meet Android requirements

#### How to run

- Copy `.env.example` to `.env` (use `REACT_APP_SOCKET_CONNECT=wss://api.samacloud.io/` to connect to PROD live env)
- Run `npm run capacitor:build`
- To run ios: `npm run ios` or android: `npm run android`

### To run with encryption capability

- Go to [matrix-org/vodozemac-bindings](https://github.com/matrix-org/vodozemac-bindings) and run the following command `wasm-pack build --target web --dev`
- Move the generated files from the `pkg` folder to the `vendors/vodozemac` folder in the project
- Declare the folder in package.json as a built-in library: `"vodozemac-javascript": "file:vendors/vodozemac"`
- Import everything from the library, call it to initialize it in the project, and now you can use it anywhere in the project

## License

[MIT](LICENSE)

## Help us!

Any thoughts, feedback is welcome! Please create a GitHub issue for any feedback you have.

Want to support us with [some coffee?](https://www.buymeacoffee.com/khomenkoigor). Will be much appreciated!
