import { createSlice } from "@reduxjs/toolkit";

export const userAuth = createSlice({
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

export const { setUserAuth } = userAuth.actions;

export default userAuth.reducer;
