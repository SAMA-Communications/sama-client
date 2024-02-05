import { createSlice } from "@reduxjs/toolkit";

export const isMobileView = createSlice({
  name: "isMobileView",
  initialState: {
    value: null,
  },
  reducers: {
    setIsMobileView: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const getIsMobileView = (state) => {
  return state.isMobileView.value;
};

export const { setIsMobileView } = isMobileView.actions;

export default isMobileView.reducer;
