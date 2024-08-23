import { createSlice } from "@reduxjs/toolkit";

export const EncryptedUser = createSlice({
  name: "EncryptedUser",
  initialState: {
    value: {},
  },
  reducers: {
    setEncryptedUser: (state, action) => void (state.value = action.payload),
  },
});

export const selectEncryptedUser = (state) => state.EncryptedUser.value;

export const { setEncryptedUser } = EncryptedUser.actions;

export default EncryptedUser.reducer;
