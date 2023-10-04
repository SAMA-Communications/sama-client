# SAMA - Simple but Advanced Messaging Alternative - Client app 

<img width="1282" alt="Screenshot 2023-01-13 at 12 54 16" src="https://user-images.githubusercontent.com/70977170/212303479-06e2169f-a609-4fa2-9ef0-7bf2f8fb68a6.png">

## Overview 

This is a frontend demo app for the SAMA server https://github.com/SAMA-Communications/sama-server

Read a complete medium post **Introducing SAMA** about what is SAMA and what problems we are trying to solve with it https://medium.com/sama-communications/introducing-sama-simple-but-advanced-messaging-alternative-chat-server-524a532e2040

## Development

- Make sure you followed SAMA server Development guide first https://github.com/SAMA-Communications/sama-server/blob/main/README.md#development
- Copy `.env.example` to `.env`.
- generate VAPID keys via `npx web-push generate-vapid-keys` and set Public Key to `REACT_APP_PUBLIC_VAPID_KEY` in `.env` file
- `npm install` to install dependencies 
- `npm run start` to run server
- access http://localhost:3000 in your browser 

## License 

[MIT](LICENSE)

## Help us!

Any thought, feedback is welcome!
