import { createSlice } from "@reduxjs/toolkit";

export const CurrentUser = createSlice({
  name: "CurrentUser",
  initialState: {
    value: {},
  },
  reducers: {
    setCurrentUser: (state, action) => void (state.value = action.payload),
    updateCurrentUser: (state, action) =>
      void Object.assign(state.value, action.payload),
  },
});

export const selectCurrentUser = (state) => state.currentUser.value;

export const { setCurrentUser, updateCurrentUser } = CurrentUser.actions;

export default CurrentUser.reducer;
