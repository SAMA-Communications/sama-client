import { createSlice } from "@reduxjs/toolkit";

export const participants = createSlice({
  name: "Participants",
  initialState: {
    value: [],
  },
  reducers: {
    setUsers: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setUsers } = participants.actions;

export default participants.reducer;
