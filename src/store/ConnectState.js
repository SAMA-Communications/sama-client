import { createSlice } from "@reduxjs/toolkit";

export const connectState = createSlice({
  name: "ConnectState",
  initialState: {
    value: false,
  },
  reducers: {
    updateState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const getConnectState = (state) => {
  return state.connectState.value;
};

export const { updateState } = connectState.actions;

export default connectState.reducer;
