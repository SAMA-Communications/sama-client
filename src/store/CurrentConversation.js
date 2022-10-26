import { createSlice } from "@reduxjs/toolkit";

export const conversation = createSlice({
  name: "CurrentConversation",
  initialState: {
    value: {},
  },
  reducers: {
    setConversation: (state, action) => {
      state.value = action.payload;
    },
    clearConversation: (state) => {
      state.value = {};
    },
  },
});

export const { setConversation, clearConversation } = conversation.actions;

export default conversation.reducer;
