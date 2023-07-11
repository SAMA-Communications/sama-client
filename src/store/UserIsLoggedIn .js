import { createSlice } from "@reduxjs/toolkit";

export const userIsLoggedIn = createSlice({
  name: "UserAuth",
  initialState: {
    value: false,
  },
  reducers: {
    setUserAuth: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUserAuth } = userIsLoggedIn.actions;

export default userIsLoggedIn.reducer;
