import { createSlice } from "@reduxjs/toolkit";

export const CurrentUserId = createSlice({
  name: "CurrentUserId",
  initialState: {
    value: { id: null },
  },
  reducers: {
    setCurrentUserId: (state, action) => void (state.value.id = action.payload),
  },
});

export const selectCurrentUserId = (state) => state.currentUserId.value.id;

export const { setCurrentUserId } = CurrentUserId.actions;

export default CurrentUserId.reducer;
