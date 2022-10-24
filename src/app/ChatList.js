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
    addChat: (state, action) => {
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

export const { addChat, removeChat, setValue } = chatList.actions;

export default chatList.reducer;
