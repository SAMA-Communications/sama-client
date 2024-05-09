# Changelog

## 1.0.0

### Improvements

- Brand new UI
- Added loads in the places of data download
- Added skeleton for basic client windows
- Added support for links in the text of messages
- Added support for automatic login after registration
- Added a pop-up window for requesting notifications
- Implemented support for third-party (custom) protocols for the server architecture
- Improved screen and logic for editing user or chat data
- Implemented the maximum speed of activity status exchange between users
- Implemented a list of users in group chat
- Improved support for heic image format
- Implemented the ability to add or remove users from the chat
- Improved chat and user account deletion logic
- Improved synchronisation of active actions (adding/removing a user from the chat, etc.)
- Improved optimisation of the interface for different screen sizes
- Unlocked sending up to 10 files at once
- Updated icons all over the client
- Fixed many inaccuracies and offsets of small objects

### Important fixes

- Fixed the display of the size of atchments
- Fixed distortion of the size of attributes when loading
- Fixed display of images in chat with different resolutions
- Fixed a bug with double notifications when the user is logged in
- Fixed the loss of focus from the input when sending messages and reloading the page
- Fixed permanent user logout at any screen resizing
- Fixed the loss of subscription to user activity after the rack reload
- Fixed incorrect redirect to chat when clicking on a notification
- Fixed redirect to pages when using the 'Back' and 'Next' system buttons
- Fixed an incorrect change in the size of the inbox for message text
- Blocked the ability to create a chat with yourself

## 0.5.1

### Updated

- Integrated System Message API for conversation event messages

## 0.5.0

### Features

- Improved functionality for **uploading links** to images. This will allow the bot to send picture in response, and in the future, it will optimize the forwarding of messages with attachments to other chats.
- Implemented support for **video** attribution. Now video attachments are also supported, along with image attachments (up to 100 MB)(available formats .webm .mp4 .mov).
- For all images sent by the user, a **blurHash** string is generated. Using the `react-blurhash` library, this string will be converted into a **compressed** image for previewing the image on the client while the **full size** image is being loaded.
- Implemented an algorithm for **compressing** the size of images sent as attachments to a message.

### Improvements

- To make the code cleaner, all import paths have been **optimized**. The `react-app-alias` library has been used to convert the annoying and long import strings `../.../.../.../.../.../.../.../myFile.js` to `@components/myFile.js`.
- Optimized algorithm for displaying pages and containers.
- Improved processing of `.heic` images and **compression** of their size.

## 0.4.0

### Features

- Implemented echo Chat bot
- Links within chat are clickable and highlighted
- Implemented the functionality to add users to the created group
- Implemented the functionality to remove users from the group

## 0.3.0

### Features

- Added support and highlighting of links in chat
- Implement a screen with detailed information about the chat

## 0.0.2

### Features

- Added a page with information about the user
- The ability to edit user information has been implemented
- Implemented uploading HEIC files

### Important fixes

- The page title could be displayed incorrectly for users with a light system theme by default
- Fixed an issue with the ability to upload any files

### Improvement

- The user's last activity is now updated without delay
- Added handling of responses without a unique identifier

## 0.0.1

### Features

- Implemented new UI for list of chats for mobile browsers

### Important fixes

- Badge about unread messages doesn’t work properly
- Chats from the previous user are displayed after relogin with a new one
- Implemented ‘long time ago’ when a user was online more than 1 year
- Unable to open chat after closing it by tapping on the system ‘back’ button

### Improvement

- Consolidated the names of all controller requests to one view

## 0.0.1 (Example)

### Important Notes

- **Important**: Removed something
- **Important**: Updated something
- App now requires something

### Maintenance

- Removed a redundant feature
- Added a new functionality
- Improved overall performance
  - Enhanced user interface responsiveness

### Docker

- Added `Dockerfile`

### Features

- :tada: Implemented a new feature
  - This feature allows users to...
- Added a user profile customization option

### Bug Fixes

- Fixed a critical issue that caused...
