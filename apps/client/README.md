## How to run Web

- Make sure you followed SAMA server Development guide first https://github.com/SAMA-Communications/sama-server/blob/main/README.md#development
- Copy `.env.example` to `.env`.
- Generate VAPID keys via `npx web-push generate-vapid-keys` and set Public Key to `VITE_PUBLIC_VAPID_KEY` in `.env` file
- `npm install` to install dependencies
- `npm run start` to run server
- Access http://localhost:3000 in your browser

There are also other components. Make sure to check [Deploying SAMA chat server stack: a comprehensive guide](https://medium.com/sama-communications/deploying-sama-chat-server-stack-a-comprehensive-guide-294ddb9a2d78)
