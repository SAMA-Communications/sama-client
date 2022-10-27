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
  },
});

export const { setConversation } = conversation.actions;

export default conversation.reducer;
