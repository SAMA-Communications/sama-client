import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

export const messagesAdapter = createEntityAdapter({
  selectId: ({ _id }) => _id,
});

export const messagesSelectors = messagesAdapter.getSelectors(
  (state) => state.messages
);

export const messages = createSlice({
  name: "Messages",
  initialState: messagesAdapter.getInitialState(),
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessage: messagesAdapter.addOne,
    removeMessage: messagesAdapter.removeOne,
  },
});

export const { setMessages, addMessage, removeMessage } = messages.actions;

export default messages.reducer;
