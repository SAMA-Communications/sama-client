import { createSlice } from "@reduxjs/toolkit";

export const isTabletView = createSlice({
  name: "isTabletView",
  initialState: {
    value: null,
  },
  reducers: {
    setIsTabletView: (state, action) => void (state.value = action.payload),
  },
});

export const getIsTabletView = (state) => state.isTabletView.value;

export const { setIsTabletView } = isTabletView.actions;

export default isTabletView.reducer;
