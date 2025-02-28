import { createSlice } from "@reduxjs/toolkit";

export const selectedConversation = createSlice({
  name: "SelectedConversation",
  initialState: {
    value: {},
  },
  reducers: {
    setSelectedConversation: (state, action) =>
      void (state.value.id = action.payload.id),
    clearSelectedConversation: (state) => void (state.value.id = null),
  },
});

export const getSelectedConversationId = (state) =>
  state.selectedConversation.value.id;

export const { setSelectedConversation, clearSelectedConversation } =
  selectedConversation.actions;

export default selectedConversation.reducer;
