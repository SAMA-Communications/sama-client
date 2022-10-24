import { createSlice } from "@reduxjs/toolkit";

export const messageArr = createSlice({
  name: "messageArr",
  initialState: {
    value: [],
  },
  reducers: {
    setArr: (state, action) => {
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

export const { setArr, addMessage, removeMessage } = messageArr.actions;

export default messageArr.reducer;
