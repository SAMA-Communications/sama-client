# UI-kit component inventory

Public exports from `src/index.ts` (components and skeletons). AI specs live in `ai/components/<Name>.md` and `ai/components.index.json`.

**Documented in index:** 57 — full public component + skeleton set (see `components.index.json`).

| Component | Category | AI doc | Types file |
| --------- | -------- | ------ | ---------- |
| AdditionalMessages | composite | yes | `AdditionalMessages.types.ts` |
| AttachModal | composite | yes | `AttachModal.types.ts` |
| ChatMessage | composite | yes | `ChatMessage.types.ts` |
| ChatNameInput | composite | yes | `ChatNameInput.types.ts` |
| ContextMenu | composite | yes | `ContextMenu.types.ts` |
| ConversationHeader | composite | yes | `ConversationHeader.types.ts` |
| ConversationInfo | composite | yes | `ConversationInfo.types.tsx` |
| ConversationInput | composite | yes | `ConversationInput.type.ts` |
| ConversationItemList | composite | yes | `ConversationItemList.types.ts` |
| ConversationSelectModal | composite | yes | `ConversationSelectModal.types.ts` |
| CustomVerticalScrollbar | composite | yes | `CustomVerticalScrollbar.types.ts` |
| EditModalContainer | composite | yes | `EditModalContainer.types.ts` |
| EditorCodePanel | composite | yes | `EditorCodePanel.types.ts` |
| EditorHelperBar | composite | yes | `EditorHelperBar.types.ts` |
| EditorLogsPanel | composite | yes | `EditorLogsPanel.types.ts` |
| EditorValidationBar | composite | yes | `EditorValidationBar.types.ts` |
| MediaAttachments | composite | yes | `MediaAttachments.types.ts` |
| MediaViewer | composite | yes | `MediaViewer.types.ts` |
| OtherUserProfile | composite | yes | `OtherUserProfile.types.ts` |
| ProgrammableEditorDocsBanner | composite | yes | `ProgrammableEditorDocsBanner.types.ts` |
| ResetPasswordModal | composite | yes | `ResetPasswordModal.types.ts` |
| SearchBlock | composite | yes | `SearchBlock.types.ts` |
| SearchConversationList | composite | yes | `SearchConversationList.types.ts` |
| SummaryContainer | composite | yes | `SummaryContainer.types.ts` |
| UserProfile | composite | yes | `UserProfile.types.ts` |
| UserSelectorBlock | composite | yes | `UserSelectorBlock.types.ts` |
| ContextMenuItem | element | yes | `ContextMenuItem.types.ts` |
| ConversationItem | element | yes | `ConversationItem.types.ts` |
| DotsLoader | element | yes | `DotsLoader.types.tsx` |
| DynamicAvatar | element | yes | `DynamicAvatar.types.ts` |
| ImageLoader | element | yes | `ImageLoader.types.tsx` |
| ImageView | element | yes | `ImageView.types.ts` |
| InfoBox | element | yes | `InfoBox.types.ts` |
| InformativeMessage | element | yes | `InformativeMessage.types.ts` |
| InteractiveDate | element | yes | `InteractiveDate.types.ts` |
| MagicButton | element | yes | `MagicButton.type.ts` |
| MediaAttachment | element | yes | `MediaAttachment.types.ts` |
| MediaBlurHash | element | yes | `MediaBlurHash.types.ts` |
| MessageInput | element | yes | `MessageInput.type.ts` |
| MessageLinkPreview | element | yes | `MessageLinkPreview.types.ts` |
| MessageStatus | element | yes | `MessageStatus.types.ts` |
| MessageUserIcon | element | yes | `MessageUserIcon.types.ts` |
| Modal | element | yes | `Modal.types.ts` |
| OvalLoader | element | yes | `OvalLoader.types.ts` |
| SearchInput | element | yes | `SearchInput.types.ts` |
| SearchedUser | element | yes | `SearchedUser.types.ts` |
| SocketConnectingLine | element | yes | `SocketConnectingLine.types.ts` |
| TextAreaInput | element | yes | `TextAreaInput.types.ts` |
| TypingLine | element | yes | `TypingLine.types.ts` |
| UserAvatar | element | yes | `UserAvatar.types.ts` |
| UserInfo | element | yes | `UserInfo.types.ts` |
| VideoView | element | yes | `VideoView.types.ts` |
| ChatListSkeleton | skeleton | yes | `skeletons/ChatListSkeleton.tsx` |
| ChatMessageSkeleton | skeleton | yes | `skeletons/ChatMessageSkeleton.tsx` |
| ConversationItemSkeleton | skeleton | yes | `skeletons/ConversationItemSkeleton.tsx` |
| MessageListSkeleton | skeleton | yes | `skeletons/MessageListSkeleton.tsx` |
| PageLoaderSkeleton | skeleton | yes | `skeletons/PageLoaderSkeleton.tsx` |

**Not exported from `src/index.ts`** (internal pieces, hooks, utils): e.g. `WrapperRoot`, `ParticipantInChat`, `ConversationInfoAvatar`, `LastMessage`, `LastMessageMedia`, `UserProfileAvatar`, `PlayButton`, `AvatarWithFallback`, `OtherUserProfileViewCard` / `OtherUserProfileViewCompact`. They are **not** in `components.index.json`. **Behavior and composition** for agents and maintainers: [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md). When a module becomes a public export, add `ai/components/<Name>.md`, an index entry, and a row in the table above.

**Process for new public exports:** add `ai/components/<Name>.md`, extend `components.index.json`, add a row here.

**More for agents:** [`ADAPTERS.md`](./ADAPTERS.md), [`RECIPES.md`](./RECIPES.md), [`TYPE_VS_IMPLEMENTATION.md`](./TYPE_VS_IMPLEMENTATION.md), [`INTERNAL_BUILDING_BLOCKS.md`](./INTERNAL_BUILDING_BLOCKS.md).
