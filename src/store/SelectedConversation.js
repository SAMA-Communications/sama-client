import { createSlice } from "@reduxjs/toolkit";

export const selectedConversation = createSlice({
  name: "SelectedConversation",
  initialState: {
    value: {},
  },
  reducers: {
    setSelectedConversation: (state, action) => {
      state.value.id = action.payload.id;
    },
  },
});

export const getSelectedConversationId = (state) => {
  return state.selectedConversation.value.id;
};

export const { setSelectedConversation } = selectedConversation.actions;

export default selectedConversation.reducer;
