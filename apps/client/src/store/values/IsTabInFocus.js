import { createSlice } from "@reduxjs/toolkit";

export const isTabInFocus = createSlice({
  name: "isTabInFocus",
  initialState: {
    value: null,
  },
  reducers: {
    setIsTabInFocus: (state, action) => void (state.value = action.payload),
  },
});

export const getIsTabInFocus = (state) => state.isTabInFocus.value;

export const { setIsTabInFocus } = isTabInFocus.actions;

export default isTabInFocus.reducer;
