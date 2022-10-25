import { createSlice } from "@reduxjs/toolkit";

export const conversations = createSlice({
  name: "Conversations",
  initialState: {
    value: [],
  },
  reducers: {
    setChats: (state, action) => {
      state.value = action.payload;
    },
    upsertChat: (state, action) => {
      if (!state.value.some((elem) => elem._id === action.payload._id))
        state.value.push(action.payload);
    },
    removeChat: (state, action) => {
      const index = state.value.findIndex(
        (elem) => elem._id === action.payload
      );
      if (index) state.value.splice(index, 1);
    },
  },
});

export const { setChats, upsertChat, removeChat } = conversations.actions;

export default conversations.reducer;
