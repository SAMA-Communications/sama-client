import { createSlice } from "@reduxjs/toolkit";

export const userIsLoggedIn = createSlice({
  name: "UserIsLoggedIn",
  initialState: {
    value: false,
  },
  reducers: {
    setUserIsLoggedIn: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const getUserIsLoggedIn = (state) => {
  return state.userIsLoggedIn.value;
};

export const { setUserIsLoggedIn } = userIsLoggedIn.actions;

export default userIsLoggedIn.reducer;
