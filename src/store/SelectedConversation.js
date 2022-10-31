import { createSlice } from "@reduxjs/toolkit";

export const selectedConversation = createSlice({
  name: "SelectedConversation",
  initialState: {
    value: {},
  },
  reducers: {
    setConversation: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setConversation } = selectedConversation.actions;

export default selectedConversation.reducer;
