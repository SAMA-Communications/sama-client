import { createSlice } from "@reduxjs/toolkit";

export const networkState = createSlice({
  name: "NetworkState",
  initialState: {
    value: false,
  },
  reducers: {
    updateNetworkState: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const getNetworkState = (state) => {
  return state.networkState.value;
};

export const { updateNetworkState } = networkState.actions;

export default networkState.reducer;
