import { createSlice } from "@reduxjs/toolkit";

export const messages = createSlice({
  name: "Messages",
  initialState: {
    value: [],
  },
  reducers: {
    setMessages: (state, action) => {
      state.value = action.payload.reverse();
    },
    addMessage: (state, action) => {
      state.value.push(action.payload);
    },
    removeMessage: (state, action) => {
      const index = state.value.findIndex((elem) => elem.id === action.payload);
      if (index) state.value.splice(index, 1);
    },
  },
});

export const { setMessages, addMessage, removeMessage } = messages.actions;

export default messages.reducer;
