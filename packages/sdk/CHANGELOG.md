# Changelog

## 0.17.1

- Added `Config` interface
- Added `disableAutoReconnect` option in config
- `connect` method can receive 2 arguments (`wsEndpoint`, `httpEndpoint`)

## 0.17.0

### Features

- Added `onMessageReactionsListener` for incoming message reaction updates

### Improvements

- WebSocket initialization reliability and flow
- Refined handling for several API requests

## 0.16.0

### Features

- Added public listener `onMessageDeleteListener` for messages
- Added public listener `onMessageEditListener` for messages
- Added support for `message_delete` request
- Added support for `message_edit` request
- Implemented methods for the reset password feature
- Implemented methods for the AI agent to change the tone of messages and summarize them

### Updates

- The `email` field is now required when creating a user

## 0.15.0

### Features

- Added support `forwarded_message_id` field for Message obejct

## 0.14.0

### Features

- Added support `replied_message_id` field for Message obejct

## 0.13.0

### Features

- Added support for all new requests for the programmable chat feature
- Added support for organizations

### Improvements

- Improved handler for http errors

## 0.12.1

### Important fixes

- Fixed handling `lt` and `gt` parameters in `converssation_list` request

## 0.12.0

### Improvements

- Updated README.md

## 0.11.0

### Features

- Added support for all necessary methods of interaction with the server api for sama-client
