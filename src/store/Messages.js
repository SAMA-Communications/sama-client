import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const messagesAdapter = createEntityAdapter({
  selectId: ({ cid }) => cid,
});

export const {
  selectAll: selectAllMessages,
  selectById: selectMessageById,
  selectEntities: selectMessagesEntities,
  selectIds: selectMessagesIds,
  selectTotal: selectTotalMessages,
} = messagesAdapter.getSelectors((state) => state.messages);

export const messages = createSlice({
  name: "Messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessage: messagesAdapter.addOne,
    updateMessage: messagesAdapter.updateOne,
    removeMessage: messagesAdapter.removeOne,
    removeAllMessages: messagesAdapter.removeAll,
  },
});

export const {
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  removeAllMessages,
} = messages.actions;

export default messages.reducer;
