import { createSlice } from "@reduxjs/toolkit";

export const selectedConversation = createSlice({
  name: "SelectedConversation",
  initialState: {
    value: {},
  },
  reducers: {
    setSelectedConversation: (state, action) => {
      state.value = action.payload;
    },
    upsertSelectedConversation: (state, action) => {
      state.value = { ...state.value, ...action.payload };
    },
  },
});

export const { setSelectedConversation, upsertSelectedConversation } =
  selectedConversation.actions;

export default selectedConversation.reducer;
