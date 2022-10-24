import { createSlice } from "@reduxjs/toolkit";

export const chatList = createSlice({
  name: "chatList",
  initialState: {
    value: [],
  },
  reducers: {
    setValue: (state, action) => {
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

export const { upsertChat, removeChat, setValue } = chatList.actions;

export default chatList.reducer;
