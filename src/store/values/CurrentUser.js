import { createSlice } from "@reduxjs/toolkit";

export const CurrentUser = createSlice({
  name: "CurrentUser",
  initialState: {
    value: {},
  },
  reducers: {
    setCurrentUser: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const getCurrentUser = (state) => {
  return state.currentUser.value;
};

export const { setCurrentUser } = CurrentUser.actions;

export default CurrentUser.reducer;
