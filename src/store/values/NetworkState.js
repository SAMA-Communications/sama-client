import { createSlice } from "@reduxjs/toolkit";

export const networkState = createSlice({
  name: "NetworkState",
  initialState: {
    value: true,
  },
  reducers: {
    updateNetworkState: (state, action) => void (state.value = action.payload),
  },
});

export const getNetworkState = (state) => state.networkState.value;

export const { updateNetworkState } = networkState.actions;

export default networkState.reducer;
